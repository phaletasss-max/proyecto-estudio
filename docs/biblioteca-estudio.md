# Biblioteca de estudio de ShadowBytes

La sección `/library` reúne archivos de práctica y writeups de referencia para miembros. El panel `/dashboard` prioriza los repasos vencidos y las prácticas en curso.

La biblioteca coloca primero **tu mejor siguiente paso**: un repaso vencido, una práctica en curso o un laboratorio guiado antes que material nuevo. Al abrir un recurso, la sección **Sesión enfocada** muestra cuatro hitos y permite preparar una acción concreta, crear la estructura del writeup y programar un repaso en siete días. Estas acciones preparan un borrador; pulsa **Guardar mi progreso** para sincronizarlo con tu cuenta.

## Una sesión de aprendizaje

1. Elige un material y escribe una **siguiente acción concreta**.
2. Cambia a **En práctica**, revisa los archivos y documenta tus intentos.
3. Si necesitas ayuda, abre explícitamente el writeup de referencia. Puede incluir spoilers y flags; su presencia no demuestra que la solución siga funcionando.
4. Escribe tu propio procedimiento, evidencias y conclusión. **Escribir mi writeup** permite dejar este trabajo pendiente.
5. Programa una fecha y usa **Para repasar**. Repite el procedimiento sin consultar la solución.
6. Marca **Aprendido** cuando puedas explicarlo. Se exige una reflexión propia de 80 caracteres como mínimo, pero no es una evaluación técnica.

Pulsa **Guardar mi progreso** antes de salir. El estado, la siguiente acción, el writeup personal y la fecha se guardan en Supabase por cuenta. Puedes exportar tu writeup a Markdown. La biblioteca no concede puntos ni acredita solves: los laboratorios guiados mantienen su validación de flag y su solución protegida.

## Importar la colección local

```powershell
python scripts/prepare-study-library.py --source D:/HTB
python -m unittest discover -s tests -p "test_*import.py"
```

El script lee los ZIP de la raíz y de `resolution/*`, agrupa copias idénticas por SHA-256 y conserva las variantes con contenido diferente. Asocia los writeups existentes por nombre de reto. No extrae, ejecuta, conecta a servicios del reto ni afirma haber verificado las soluciones.

La salida está en `ctf-import.local/library/`, ignorada por Git:

- `manifest.json`: materiales y objetos esperados, sin soluciones.
- `inventory.json`: procedencia local y copias encontradas.
- `files/`: copias de ZIP y referencias Markdown privadas.
- `import.sql`: importación idempotente que exige los objetos antes de publicar filas. No modifica progreso ni puntos.
- `verification.json`: resumen de preparación; no acredita una subida real.

### Publicación

El comando `node scripts/publish-study-library.mjs` verifica hashes locales y reconstrucción de partes sin conectarse. Tras revisar y autorizar la migración, `node scripts/publish-study-library.mjs --apply` puede aplicar el esquema y publicar usando `SUPABASE_ACCESS_TOKEN` del entorno administrativo. Recupera la credencial existente solo en memoria, comprueba cada descarga por SHA-256 y registra el resultado real en `publication.json`. No colocar esa variable ni claves de servidor en archivos `VITE_`.

1. Aplicar `supabase/migrations/20260914_study_library.sql` después de las migraciones anteriores.
2. Subir los objetos del manifiesto a la raíz del bucket privado `study-library`, manteniendo los nombres exactos. No sustituir archivos diferentes sobre un nombre existente.
3. Ejecutar `ctf-import.local/library/import.sql`. La transacción aborta si falta un objeto.
4. Verificar cantidades, tamaños, acceso por roles, descarga y guardado desde la interfaz.

Los ZIP mayores de 50 MiB se dividen en partes de 20 MiB para respetar el límite por objeto. Se descargan todas las partes a una carpeta vacía y se reconstruyen en WSL:

```bash
cat *.zip.part-* > reto.zip
sha256sum reto.zip
```

El resultado debe coincidir con el SHA-256 del original mostrado en la biblioteca. Las partes se concatenan en orden de nombre; no son ZIP independientes.

## Acceso y límites

Los miembros y administradores pueden leer materiales publicados. Solo los administradores importan materiales y objetos. Cada persona solo lee y modifica su propio progreso; cuentas suspendidas y postulantes no acceden a la biblioteca privada.

Los archivos mantienen la atribución original. No hay infraestructura de máquinas virtuales en esta biblioteca: cuando un reto necesita un servicio se utiliza una instancia autorizada de HTB o el entorno local documentado. Un ZIP cifrado conserva su contraseña original; no se adivina ni se elimina el cifrado.
