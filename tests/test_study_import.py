import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('study_import', Path(__file__).resolve().parents[1] / 'scripts' / 'prepare-study-library.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class StudyImportTests(unittest.TestCase):
    def test_dedupes_identical_archives_and_preserves_variants_and_writeup(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / 'source'
            reference = source / 'resolution' / '03_OmniWatch'
            reference.mkdir(parents=True)
            with zipfile.ZipFile(source / 'web_omniwatch.zip', 'w') as archive:
                archive.writestr('challenge.py', 'raise Exception("must never execute")')
            (reference / 'web_omniwatch.zip').write_bytes((source / 'web_omniwatch.zip').read_bytes())
            (reference / 'writeup.md').write_text('# Private solution\nHTB{test_secret}', encoding='utf8')
            output = root / 'output'
            result = module.prepare(source, output)
            self.assertEqual(result['resources'], 1)
            self.assertEqual(result['duplicate_copies'], 1)
            self.assertFalse(result['uploaded'])
            manifest = json.loads((output / 'manifest.json').read_text('utf8'))
            self.assertNotIn('test_secret', json.dumps(manifest))
            self.assertNotIn('test_secret', (output / 'import.sql').read_text('utf8'))
            self.assertEqual(len(manifest['objects']), 2)
            # A different package with the same name must not overwrite the original.
            with zipfile.ZipFile(reference / 'web_omniwatch.zip', 'w') as archive:
                archive.writestr('other.txt', 'Different version')
            second = module.prepare(source, root / 'second')
            self.assertEqual(second['resources'], 2)

    def test_sql_escaping_and_zip_validation(self):
        self.assertEqual(module.sql_value("student's file"), "'student''s file'")
        with self.assertRaises(ValueError): module.sql_value('\x00')
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'bad.zip'
            path.write_bytes(b'not a zip')
            with self.assertRaises(zipfile.BadZipFile): module.inspect_zip(path)

if __name__ == '__main__': unittest.main()
