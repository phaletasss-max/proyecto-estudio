"""Regression checks for the local-only HTB import preparation."""

import importlib.util
import ast
import copy
import json
from pathlib import Path
import re
import tempfile
import unittest
import zipfile


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("htb_import", ROOT / "scripts" / "prepare-htb-import.py")
IMPORTER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(IMPORTER)


class HtbImportTests(unittest.TestCase):
    def test_catalog_rejects_paths_outside_the_two_approved_zip_names(self):
        catalog = json.loads(IMPORTER.CATALOG.read_text(encoding="utf-8"))
        IMPORTER.validate_catalog(catalog)
        for field in ["source_zip", "storage_object"]:
            unsafe = copy.deepcopy(catalog)
            unsafe["labs"][0][field] = "../public/answers.zip"
            with self.assertRaises(ValueError):
                IMPORTER.validate_catalog(unsafe)

    def test_catalog_requires_one_verified_answer_per_guided_step(self):
        catalog = json.loads(IMPORTER.CATALOG.read_text(encoding="utf-8"))
        incomplete = {lab["slug"]: ("HTB{synthetic_test_only}", ["example"], {}) for lab in catalog["labs"]}
        with self.assertRaises(ValueError):
            IMPORTER.build_sql(catalog, incomplete)

    def test_guide_code_is_valid_python_and_lootstash_pattern_matches_bytes(self):
        catalog = json.loads(IMPORTER.CATALOG.read_text(encoding="utf-8"))
        pattern_count = 0
        for lab in catalog["labs"]:
            for step in lab["steps"]:
                for snippet in re.findall(r"```python\n(.*?)\n```", step["description"], re.S):
                    # Parse authored teaching snippets; never execute HTB files.
                    tree = ast.parse(snippet)
                    for call in (node for node in ast.walk(tree) if isinstance(node, ast.Call)):
                        if isinstance(call.func, ast.Attribute) and call.func.attr == "findall":
                            pattern = ast.literal_eval(call.args[0])
                            self.assertEqual(re.findall(pattern, b"before\x00HTB{synthetic_test_only}\x00after"), [b"HTB{synthetic_test_only}"])
                            pattern_count += 1
        self.assertEqual(pattern_count, 1)

    def test_transform_counts_punctuation_positions_and_wraps(self):
        self.assertEqual(IMPORTER.transform("AB_C", 1), "AC_F")
        original = "Z_A?!_WRAP_Z"
        self.assertEqual(IMPORTER.transform(IMPORTER.transform(original, 1), -1), original)

    def test_non_ascii_alphabet_is_rejected(self):
        with self.assertRaises(ValueError):
            IMPORTER.transform("MAÑANA", 1)

    def test_hash_normalization_matches_database_flag_forms(self):
        expected = IMPORTER.secret_hash("Example_1?!")
        for value in [" HTB{EXAMPLE_1?!} ", "sb{example_1?!}", "example_1?!"]:
            self.assertEqual(IMPORTER.secret_hash(value), expected)
        self.assertNotEqual(expected, IMPORTER.secret_hash("example_2?!"))

    def test_source_validation_never_accepts_modified_cipher(self):
        IMPORTER.verify_dynastic_source(IMPORTER.EXPECTED_SOURCE.encode())
        with self.assertRaises(ValueError):
            IMPORTER.verify_dynastic_source(IMPORTER.EXPECTED_SOURCE.replace("chi + i", "chi - i").encode())

    def test_archive_rejects_unexpected_members_and_keeps_files_in_memory(self):
        with tempfile.TemporaryDirectory() as temporary:
            archive_path = Path(temporary) / "sample.zip"
            with zipfile.ZipFile(archive_path, "w") as archive:
                archive.writestr("sample/data.txt", "plain evidence")
            self.assertEqual(IMPORTER.read_archive(archive_path, {"sample/data.txt"}), {"sample/data.txt": b"plain evidence"})
            self.assertFalse((Path(temporary) / "sample").exists())
            with self.assertRaises(ValueError):
                IMPORTER.read_archive(archive_path, {"different.txt"})

    def test_lootstash_requires_exactly_one_literal_flag(self):
        header = b"\x7fELF\x02\x01" + b"\x00" * 20
        sample = {"rev_lootstash/stash": header + b"HTB{synthetic_test_only}\x00"}
        flag, answers, report = IMPORTER.solve_lootstash(sample)
        self.assertEqual(answers, ["ELF", "64", "1"])
        self.assertFalse(report["supplied_binary_executed"])
        with self.assertRaises(ValueError):
            IMPORTER.solve_lootstash({"rev_lootstash/stash": header})
        with self.assertRaises(ValueError):
            IMPORTER.solve_lootstash({"rev_lootstash/stash": sample["rev_lootstash/stash"] * 2})

    def test_sql_scopes_catalog_and_keeps_secrets_out_of_public_rows(self):
        catalog = json.loads(IMPORTER.CATALOG.read_text(encoding="utf-8"))
        fake_flag = "HTB{synthetic_test_only}"
        fake_hash = IMPORTER.secret_hash(fake_flag)
        solutions = {lab["slug"]: (fake_flag, ["example"] * len(lab["steps"]), {}) for lab in catalog["labs"]}
        sql = IMPORTER.build_sql(catalog, solutions)
        self.assertTrue(sql.rstrip().endswith("commit;"))
        self.assertIn("end; $guard$;", sql)
        self.assertIn("HTB catalog identity conflict", sql)
        self.assertNotIn("delete from", sql.lower())
        self.assertNotIn("public.profiles", sql)
        self.assertNotIn("public.user_solves", sql)
        for statement in sql.split("insert into public.")[1:]:
            table = statement.split(" ", 1)[0]
            if table in {"labs", "lab_steps", "lab_hints"}:
                self.assertNotIn(fake_flag, statement)
                self.assertNotIn(fake_hash, statement)
        self.assertEqual(sql.count("insert into public.labs "), 2)
        self.assertEqual(sql.count("insert into public.lab_steps "), 6)
        self.assertEqual(sql.count("insert into public.lab_hints "), 12)
        self.assertEqual(sql.count("insert into public.challenge_secrets "), 2)
        self.assertEqual(sql.count("insert into public.lab_step_secrets "), 6)

    def test_sql_quotes_apostrophes_and_retains_regex_backslashes(self):
        self.assertEqual(IMPORTER.sql_text("d'Artagnan"), "'d''Artagnan'")
        self.assertEqual(IMPORTER.sql_text(r"\x20"), r"'\x20'")
        with self.assertRaises(ValueError):
            IMPORTER.sql_text("invalid\x00text")


if __name__ == "__main__":
    unittest.main()
