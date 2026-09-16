"""Inventory owned HTB archives and reference writeups. Never execute/extract them.

Outputs only to ignored ctf-import.local/library. No credentials or network needed.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import json
from pathlib import Path
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'ctf-import.local' / 'library'
CHUNK = 20 * 1024 * 1024
WRITEUPS = {
    'blockchain_notademocraticelection': '01_NotADemocraticElection',
    'crypto_blessed': '02_Blessed', 'web_omniwatch': '03_OmniWatch',
    'rev_satellitehijack': '04_SatelliteHijack', 'pwn_void': '05_Void',
    'web_blueprint_heist': '06_BlueprintHeist', 'misc_prison_pipeline': '07_PrisonPipeline',
    'forensics_phreaky': '08_Phreaky', 'rev_tunnelmadness': '08b_TunnelMadness',
    'pwn_regularity': '09_Regularity',
}
CATEGORIES = {'crypto': 'Crypto', 'web': 'Web', 'pwn': 'Pwn', 'rev': 'Reversing',
              'forensics': 'Forensics', 'hardware': 'Hardware', 'hw': 'Hardware',
              'ics': 'ICS', 'blockchain': 'Blockchain', 'misc': 'Misc'}
OBJECTIVES = {
    'Crypto': 'Identificar la transformación o protocolo, probar una hipótesis y explicar por qué permite recuperar información.',
    'Web': 'Relacionar las entradas y componentes de la aplicación con su comportamiento; documentar una prueba reproducible en el laboratorio.',
    'Pwn': 'Comprender el formato del binario y sus protecciones antes de reproducir el comportamiento en un entorno aislado.',
    'Reversing': 'Leer el programa como datos, identificar su lógica y documentar cómo comprobar la hipótesis.',
    'Forensics': 'Construir una conclusión a partir de los archivos, citando las evidencias y sus limitaciones.',
    'Hardware': 'Identificar los formatos y señales entregados y explicar qué información puede recuperarse de ellos.',
    'ICS': 'Reconocer la estructura del protocolo y justificar cada conclusión con una evidencia del material.',
    'Blockchain': 'Revisar el contrato y sus supuestos de validación; explicar el resultado de una prueba controlada.',
    'Misc': 'Definir el objetivo del reto, inventariar sus archivos y construir un procedimiento reproducible.',
}

def digest(path: Path) -> str:
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()

def inspect_zip(path: Path) -> dict:
    # Central directory only; no expansion, passwords, or challenge execution.
    with zipfile.ZipFile(path) as archive:
        members = archive.infolist()
        return {'members': len(members), 'encrypted': any(item.flag_bits & 1 for item in members)}

def sql_value(value):
    if value is None: return 'null'
    if isinstance(value, bool): return 'true' if value else 'false'
    if isinstance(value, int): return str(value)
    if isinstance(value, list): return sql_value(json.dumps(value, ensure_ascii=False)) + '::jsonb'
    if '\x00' in value: raise ValueError('NUL in SQL value')
    return "'" + value.replace("'", "''") + "'"

def resource_title(stem: str, category: str) -> str:
    if re.match(r'^a[0-9a-f]{7}-', stem): return 'Archivo por identificar · ' + stem[:8]
    name = stem.split('_', 1)[1] if stem.split('_')[0] in CATEGORIES else stem
    return name.replace('_', ' ').title()

def prepare(source: Path, output: Path = OUTPUT) -> dict:
    files_dir = output / 'files'
    files_dir.mkdir(parents=True, exist_ok=True)
    sources = sorted(source.glob('*.zip')) + sorted((source / 'resolution').glob('*/*.zip'))
    by_hash = {}
    for path in sources:
        sha = digest(path)
        if sha in by_hash:
            by_hash[sha]['copies'].append(str(path))
            continue
        by_hash[sha] = {'path': path, 'copies': [str(path)]}
    resources, inventory, objects = [], [], []
    for sha, entry in by_hash.items():
        path = entry['path']
        inspection = inspect_zip(path)
        stem = path.stem.lower()
        category = CATEGORIES.get(stem.split('_')[0], 'Forensics' if stem in ('brutus', 'noxious', 'ctf_forensics_shadowbytes') else 'Misc')
        slug = re.sub(r'[^a-z0-9]+', '-', stem).strip('-')[:80] + '-' + sha[:12]
        size = path.stat().st_size
        archive_path, parts = None, []
        if size <= 50 * 1024 * 1024:
            archive_path = slug + '.zip'
            shutil.copyfile(path, files_dir / archive_path)
            objects.append({'path': archive_path, 'bytes': size, 'sha256': sha, 'content_type': 'application/zip'})
        else:
            with path.open('rb') as stream:
                index = 1
                while data := stream.read(CHUNK):
                    name = f'{slug}.zip.part-{index:03}'
                    (files_dir / name).write_bytes(data)
                    part = {'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                    parts.append(part)
                    objects.append({**part, 'content_type': 'application/octet-stream'})
                    index += 1
        reference = source / 'resolution' / WRITEUPS.get(stem, '__missing__') / 'writeup.md'
        if stem == 'router_web': reference = source / 'router_web' / 'ANALISIS.md'
        writeup_path = None
        if reference.is_file():
            writeup_sha = digest(reference)
            writeup_path = f'{slug}-writeup-{writeup_sha[:12]}.md'
            shutil.copyfile(reference, files_dir / writeup_path)
            objects.append({'path': writeup_path, 'bytes': reference.stat().st_size, 'sha256': writeup_sha, 'content_type': 'text/markdown'})
        lab_slug = {'crypto_dynastic': 'htb-dynastic', 'rev_lootstash': 'htb-lootstash', 'ctf_forensics_shadowbytes': 'forense-redes-router'}.get(stem)
        note = 'Material inventariado; resolución y entorno pendientes de reproducir en esta importación.'
        if reference.is_file(): note += ' Writeup existente conservado con su autoría; no se ha revalidado su resultado.'
        if inspection['encrypted']: note += ' El ZIP está cifrado: usa la contraseña facilitada con el reto original.'
        if len([other for other in by_hash.values() if other['path'].stem.lower() == stem]) > 1:
            note += ' Existe otra versión del ZIP con el mismo nombre y distinto hash; se conserva como material separado.'
        resource = {
            'id': slug, 'title': resource_title(stem, category), 'category': category,
            'source': 'ShadowBytes' if stem in ('ctf_forensics_shadowbytes', 'router_web') else 'Colección HTB local',
            'objective': OBJECTIVES[category],
            'environment': 'Windows/WSL para revisar los archivos. Si el reto requiere un servicio, usa una instancia autorizada de HTB o el entorno local indicado en su documentación. No hay una máquina alojada por esta biblioteca.',
            'archive_path': archive_path, 'archive_parts': parts, 'archive_bytes': size, 'archive_sha256': sha,
            'writeup_path': writeup_path, 'readiness': 'guided' if lab_slug else 'reference_available' if writeup_path else 'needs_writeup',
            'import_note': note, 'lab_slug': lab_slug, 'is_published': True,
        }
        resources.append(resource)
        inventory.append({'id': slug, 'copies': entry['copies'], 'reference': str(reference) if reference.is_file() else None, **inspection})
    manifest = {'version': 1, 'resources': resources, 'objects': objects}
    (output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    with (output / 'resources.csv').open('w', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(resources[0]) if resources else [])
        writer.writeheader()
        for resource in resources:
            writer.writerow({key: json.dumps(value, ensure_ascii=False) if isinstance(value, (list, bool)) else value for key, value in resource.items()})
    (output / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
    # Import after all objects are uploaded; fail before any row changes if missing.
    sql = ['begin;', 'set local standard_conforming_strings = on;', "select pg_advisory_xact_lock(hashtext('shadowbytes:study-library'));", 'do $verify$ begin']
    for item in objects:
        sql.append("if not exists (select 1 from storage.objects where bucket_id = 'study-library' and name = " + sql_value(item['path']) + ") then raise exception 'Missing study object'; end if;")
    sql.append('end; $verify$;')
    for resource in resources:
        columns = ', '.join(resource)
        values = ', '.join(sql_value(value) for value in resource.values())
        updates = ', '.join(f'{key} = excluded.{key}' for key in resource if key != 'id')
        sql.append(f'insert into public.study_resources ({columns}) values ({values}) on conflict (id) do update set {updates};')
    sql += ['commit;', 'select count(*) as materials, count(writeup_path) as reference_writeups from public.study_resources where is_published;']
    (output / 'import.sql').write_text('\n'.join(sql), encoding='utf-8')
    summary = {'resources': len(resources), 'reference_writeups': sum(bool(item['writeup_path']) for item in resources), 'objects': len(objects), 'duplicate_copies': len(sources) - len(resources), 'bytes': sum(item['bytes'] for item in objects), 'uploaded': False, 'challenge_code_executed': False}
    (output / 'verification.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    return summary

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(prepare(args.source), ensure_ascii=False))
