"""Prepare two authorized, static HTB labs. Never execute supplied challenge code.

All generated artifacts, including answers and SQL, stay in ctf-import.local.
This script does not connect to Supabase or upload anything.
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
from pathlib import Path
import re
import shutil
import uuid
import zipfile


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "content" / "htb-guided" / "catalog.json"
OUTPUT = ROOT / "ctf-import.local"
SLUGS = {"htb-dynastic", "htb-lootstash"}
ARCHIVE_NAMES = {
    "htb-dynastic": ("crypto_dynastic.zip", "htb-dynastic.zip"),
    "htb-lootstash": ("rev_lootstash.zip", "htb-lootstash.zip"),
}
MAX_FILE_BYTES = 2 * 1024 * 1024
EXPECTED_SOURCE = """
def to_identity_map(a):
    return ord(a) - 0x41
def from_identity_map(a):
    return chr(a % 26 + 0x41)
def encrypt(m):
    c = ''
    for i in range(len(m)):
        ch = m[i]
        if not ch.isalpha():
            ech = ch
        else:
            chi = to_identity_map(ch)
            ech = from_identity_map(chi + i)
        c += ech
    return c
"""


def stable_id(name: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, "https://shadowbytes.vercel.app/" + name))


def normalize(value: str) -> str:
    # Mirrors public.normalize_challenge_value for these ASCII challenge values.
    normalized = value.strip(" ").lower()
    match = re.fullmatch(r"(?:htb|sb)\{(.*)\}", normalized)
    return match.group(1) if match else normalized


def secret_hash(value: str) -> str:
    return hashlib.sha256(normalize(value).encode("utf-8")).hexdigest()


def validate_catalog(catalog: dict) -> None:
    labs = catalog.get("labs", [])
    if {lab["slug"] for lab in labs} != SLUGS or len(labs) != 2:
        raise ValueError("Este importador solo admite los dos retos revisados.")
    for lab in labs:
        if (lab["source_zip"], lab["storage_object"]) != ARCHIVE_NAMES[lab["slug"]]:
            raise ValueError("Las rutas del catálogo no corresponden a los ZIP revisados.")
        if len(lab["steps"]) != 3 or any(len(step["hints"]) != 2 for step in lab["steps"]):
            raise ValueError("Cada reto revisado requiere tres pasos y dos pistas por paso.")


def read_archive(path: Path, expected_names: set[str]) -> dict[str, bytes]:
    """Read only expected small files into memory; never extract or execute them."""
    with zipfile.ZipFile(path) as archive:
        members = [item for item in archive.infolist() if not item.is_dir()]
        names = [item.filename for item in members]
        if len(names) != len(set(names)) or set(names) != expected_names:
            raise ValueError("El ZIP no coincide con los archivos esperados; revisar manualmente.")
        result = {}
        for member in members:
            if member.flag_bits & 1 or member.file_size > MAX_FILE_BYTES:
                raise ValueError("Archivo cifrado o demasiado grande; no se importará automáticamente.")
            if ".." in Path(member.filename).parts or member.filename.startswith(("/", "\\")):
                raise ValueError("Ruta de archivo no permitida.")
            data = archive.read(member)
            if len(data) != member.file_size:
                raise ValueError("Tamaño del archivo inconsistente.")
            result[member.filename] = data
    return result


def verify_dynastic_source(source: bytes) -> None:
    tree = ast.parse(source.decode("utf-8"))
    expected = ast.parse(EXPECTED_SOURCE)
    functions = [item for item in tree.body if isinstance(item, ast.FunctionDef)]
    if [ast.dump(item) for item in functions] != [ast.dump(item) for item in expected.body]:
        raise ValueError("El algoritmo de Dynastic cambió; requiere revisión estática manual.")


def transform(text: str, direction: int) -> str:
    if any(character.isalpha() and not "A" <= character <= "Z" for character in text):
        raise ValueError("El mensaje debe usar el alfabeto ASCII en mayúsculas.")
    return "".join(
        chr((ord(character) - 65 + direction * index) % 26 + 65)
        if "A" <= character <= "Z" else character
        for index, character in enumerate(text)
    )


def solve_dynastic(files: dict[str, bytes]) -> tuple[str, list[str], dict]:
    verify_dynastic_source(files["crypto_dynastic/source.py"])
    lines = files["crypto_dynastic/output.txt"].decode("utf-8").splitlines()
    if len(lines) != 2 or "HTB flag format" not in lines[0]:
        raise ValueError("Formato inesperado en output.txt; revisar antes de importar.")
    ciphertext = lines[1]
    plaintext = transform(ciphertext, -1)
    if transform(plaintext, 1) != ciphertext or transform("AB_C", 1) != "AC_F":
        raise ValueError("La comprobación independiente de recifrado falló.")
    flag = "HTB{" + plaintext + "}"
    if not re.fullmatch(r"HTB\{[\x20-\x7e]{1,200}\}", flag):
        raise ValueError("La flag recuperada no tiene un formato válido.")
    return flag, ["output.txt", "0", "AB_C"], {
        "method": "AST comparison plus independent inverse transformation and re-encryption",
        "reencryption_matches_original": True,
        "example_round_trip": True,
        "supplied_code_executed": False,
    }


def solve_lootstash(files: dict[str, bytes]) -> tuple[str, list[str], dict]:
    data = files["rev_lootstash/stash"]
    if data[:4] != b"\x7fELF" or data[4] not in (1, 2):
        raise ValueError("Encabezado de LootStash inesperado.")
    flags = re.findall(rb"HTB\{[\x20-\x7e]{1,200}?\}", data)
    if len(flags) != 1:
        raise ValueError("Se esperaba una sola flag literal; revisar el binario como datos.")
    return flags[0].decode("ascii"), ["ELF", str(32 if data[4] == 1 else 64), "1"], {
        "method": "ELF header inspection and printable ASCII pattern search",
        "literal_flag_matches": len(flags),
        "supplied_binary_executed": False,
    }


def sql_text(value: str) -> str:
    # Standard PostgreSQL literal: backslashes retain their literal value.
    if "\x00" in value:
        raise ValueError("No se permiten bytes nulos en el contenido SQL.")
    return "'" + value.replace("'", "''") + "'"


def upsert(table: str, values: dict, conflict: str) -> str:
    def sql_value(value):
        if isinstance(value, bool):
            return "true" if value else "false"
        if isinstance(value, int):
            return str(value)
        if isinstance(value, list):
            return "array[" + ", ".join(sql_text(item) for item in value) + "]::text[]"
        return sql_text(value)

    columns = ", ".join(values)
    insert_values = ", ".join(sql_value(value) for value in values.values())
    updates = ", ".join(f"{column} = excluded.{column}" for column in values if column != conflict)
    return f"insert into public.{table} ({columns})\nvalues ({insert_values})\non conflict ({conflict}) do update set {updates};\n"


def build_writeup(slug: str, flag: str) -> str:
    if slug == "htb-dynastic":
        return r"""# Dynastic: explicación de la solución

El código original de Hack The Box suma la posición del carácter a su índice
en el alfabeto inglés. Las posiciones empiezan en cero e incluyen guiones y signos.
Para invertirlo, se resta la misma posición y se reduce módulo 26:

```python
from pathlib import Path

cifrado = Path('output.txt').read_text(encoding='utf-8').splitlines()[-1]
recuperado = ''.join(
    chr((ord(letra) - 65 - i) % 26 + 65) if 'A' <= letra <= 'Z' else letra
    for i, letra in enumerate(cifrado)
)
print('HTB{' + recuperado + '}')
```

Como verificación, volver a sumar cada posición al mensaje recuperado reproduce
exactamente la línea cifrada original. La prueba `AB_C → AC_F → AB_C` comprueba
que el guion también consume una posición. No se ejecutó el código entregado por
el reto y no se necesita el módulo `secret`.

**Flag verificada:** `""" + flag + """`

La debilidad es una transformación predecible sin una clave secreta que impida
invertirla. Esta técnica educativa no debe usarse para proteger información real.

Reto original: Hack The Box. Guía y verificación estática: ShadowBytes.
"""
    return r"""# LootStash: explicación de la solución

El archivo empieza por `7f 45 4c 46`, firma ELF, y su quinto byte vale 2: es ELF de
64 bits. Esa información puede leerse desde cualquier sistema sin ejecutar el
archivo. Al buscar cadenas ASCII con la forma de flag aparece una sola coincidencia.

```python
from pathlib import Path
import re

datos = Path('stash').read_bytes()
for candidata in re.findall(rb'HTB\{[\x20-\x7e]{1,200}?\}', datos):
    print(candidata.decode('ascii'))
```

**Flag verificada:** `""" + flag + """`

La solución se obtiene mediante análisis estático: `read_bytes()` trata el binario
como datos. No se inició el programa ni se utilizó una máquina virtual.
El hallazgo muestra por qué incrustar secretos como texto en un ejecutable no los
protege. Un reto con cadenas cifradas u ofuscadas exigiría otra estrategia.

Reto original: Hack The Box. Guía y verificación estática: ShadowBytes.
"""


def build_sql(catalog: dict, solutions: dict) -> str:
    validate_catalog(catalog)
    if any(len(solutions[lab["slug"]][1]) != len(lab["steps"]) for lab in catalog["labs"]):
        raise ValueError("Cada pregunta necesita una respuesta verificada.")
    output = [
        "-- LOCAL ONLY: contains private answers and writeups. Never commit this file.",
        "-- Run after secure_ctf_admission, guided_learning_mvp and crypto_function_search_path migrations.",
        "begin;",
        "set local standard_conforming_strings = on;",
        "select pg_advisory_xact_lock(hashtext('shadowbytes:htb-guided-v1'));",
        "do $guard$ begin",
        "  if to_regclass('public.lab_step_secrets') is null then raise exception 'Apply guided learning migration first'; end if;",
    ]
    for lab in catalog["labs"]:
        lab_id = stable_id("labs/" + lab["slug"])
        output.append(
            f"  if exists (select 1 from public.labs where (slug = {sql_text(lab['slug'])} and id <> '{lab_id}') "
            f"or (id = '{lab_id}' and slug <> {sql_text(lab['slug'])})) "
            "then raise exception 'HTB catalog identity conflict; nothing changed'; end if;"
        )
        output.append(
            f"  if exists (select 1 from public.lab_steps where lab_id = '{lab_id}' and step_number > {len(lab['steps'])}) "
            "then raise exception 'Unexpected existing steps; review before importing'; end if;"
        )
        for index, step in enumerate(lab["steps"], 1):
            step_id = stable_id(f"labs/{lab['slug']}/steps/{index}")
            output.append(
                f"  if exists (select 1 from public.lab_steps where (lab_id = '{lab_id}' and step_number = {index} and id <> '{step_id}') "
                f"or (id = '{step_id}' and (lab_id <> '{lab_id}' or step_number <> {index}))) "
                "then raise exception 'HTB step identity conflict; nothing changed'; end if;"
            )
    output.append("end; $guard$;")
    for lab in catalog["labs"]:
        lab_id = stable_id("labs/" + lab["slug"])
        flag, answers, _ = solutions[lab["slug"]]
        values = {key: lab[key] for key in ("title", "slug", "difficulty", "category", "description", "points", "tags", "estimated_minutes")}
        values.update({"id": lab_id, "zip_url": lab["storage_object"], "author": "Hack The Box · Guía ShadowBytes", "is_published": True,
                       "is_admission_challenge": False, "is_members_only": False, "framework": "Análisis local con Python"})
        output.append(upsert("labs", values, "id"))
        output.append(upsert("challenge_secrets", {"lab_id": lab_id, "flag_hash": secret_hash(flag), "writeup_markdown": build_writeup(lab["slug"], flag)}, "lab_id"))
        for index, step in enumerate(lab["steps"], 1):
            step_id = stable_id(f"labs/{lab['slug']}/steps/{index}")
            output.append(upsert("lab_steps", {"id": step_id, "lab_id": lab_id, "step_number": index,
                "title": step["title"], "description": step["description"], "question": step["question"],
                "answer_format": step["answer_format"], "points": 0, "hint_count": len(step["hints"])}, "id"))
            output.append(upsert("lab_step_secrets", {"step_id": step_id, "answer_hash": secret_hash(answers[index - 1]),
                "explanation": f"Comprobación correcta: {answers[index - 1]}. Tu avance quedó guardado. " + ("Continúa con el siguiente paso." if index < len(lab["steps"]) else "Ya puedes validar la flag final.")}, "step_id"))
            for hint_index, hint in enumerate(step["hints"], 1):
                output.append(upsert("lab_hints", {"id": stable_id(f"labs/{lab['slug']}/steps/{index}/hints/{hint_index}"),
                    "step_id": step_id, "hint_number": hint_index, "content": hint, "point_penalty": 0}, "id"))
    output.extend(["notify pgrst, 'reload schema';", "commit;", ""])
    return "\n".join(output)


def prepare(source: Path) -> dict:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    validate_catalog(catalog)
    solutions = {
        "htb-dynastic": solve_dynastic(read_archive(source / "crypto_dynastic.zip", {"crypto_dynastic/source.py", "crypto_dynastic/output.txt"})),
        "htb-lootstash": solve_lootstash(read_archive(source / "rev_lootstash.zip", {"rev_lootstash/stash"})),
    }
    # Refuse a path redirected outside the ignored staging directory.
    if OUTPUT.is_symlink() or OUTPUT.resolve().parent != ROOT.resolve():
        raise ValueError("El directorio de salida no es una carpeta local del proyecto.")
    OUTPUT.mkdir(exist_ok=True)
    private = {}
    report = {"status": "prepared_locally", "database_applied": False, "storage_uploaded": False, "labs": []}
    public_files = [CATALOG, CATALOG.with_name("README.md"), Path(__file__), ROOT / "tests" / "test_htb_import.py"]
    public_material = "\n".join(path.read_text(encoding="utf-8") for path in public_files)
    for lab in catalog["labs"]:
        flag, answers, checks = solutions[lab["slug"]]
        private_markers = [flag, secret_hash(flag), *(secret_hash(answer) for answer in answers)]
        if any(marker in public_material for marker in private_markers):
            raise ValueError("Se detectó una respuesta privada en un archivo público.")
        source_zip = source / lab["source_zip"]
        target_zip = OUTPUT / lab["storage_object"]
        if target_zip.is_symlink():
            raise ValueError("El destino ZIP no puede ser un enlace simbólico.")
        shutil.copyfile(source_zip, target_zip)
        same_bytes = source_zip.read_bytes() == target_zip.read_bytes()
        if not same_bytes:
            raise ValueError("La copia del ZIP no coincide con el original.")
        private[lab["slug"]] = {"lab_id": stable_id("labs/" + lab["slug"]), "flag": flag,
            "steps": [{"step_id": stable_id(f"labs/{lab['slug']}/steps/{index}"), "answer": answer} for index, answer in enumerate(answers, 1)]}
        report["labs"].append({"slug": lab["slug"], "storage_object": lab["storage_object"],
            "steps": len(lab["steps"]), "hints": sum(len(step["hints"]) for step in lab["steps"]),
            "hint_penalties": 0, "zip_unchanged": same_bytes, "checks": checks})
    artifacts = {
        "import.sql": build_sql(catalog, solutions),
        "answers.json": json.dumps(private, indent=2, ensure_ascii=False) + "\n",
        "verification.json": json.dumps(report, indent=2, ensure_ascii=False) + "\n",
    }
    for name, content in artifacts.items():
        destination = OUTPUT / name
        if destination.is_symlink():
            raise ValueError("El artefacto de destino no puede ser un enlace simbólico.")
        destination.write_text(content, encoding="utf-8")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path("D:/HTB"), help="Directorio que contiene los dos ZIP autorizados")
    args = parser.parse_args()
    try:
        report = prepare(args.source)
    except (ValueError, OSError, zipfile.BadZipFile, SyntaxError) as error:
        raise SystemExit(f"No se preparó el paquete: {error}") from None
    print("Preparación local completada: 2 laboratorios, 6 pasos y 12 pistas gratuitas.")
    print("ZIP originales conservados y respuestas verificadas sin ejecutar código HTB.")
    print("Artefactos privados: ctf-import.local (SQL, respuestas y ZIP). No se subió ni aplicó nada.")
    for lab in report["labs"]:
        print(lab["slug"] + ": verificaciones estáticas correctas.")


if __name__ == "__main__":
    main()
