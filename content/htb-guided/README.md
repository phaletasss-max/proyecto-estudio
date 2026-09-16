# Paquete guiado de HTB para ShadowBytes

Dos retos preparados para aprender mediante archivos locales, sin alojar máquinas
virtuales ni ejecutar los programas entregados por HTB:

- **Dynastic:** leer un algoritmo de sustitución, invertirlo y comprobar el mensaje mediante recifrado. Nivel básico, aproximadamente 30 minutos.
- **LootStash:** identificar un encabezado ELF y buscar cadenas ASCII en un binario como datos. Nivel básico, aproximadamente 25 minutos.

Cada reto incluye tres pasos, preguntas con validación en el servidor, dos pistas
gratuitas por paso y una solución que solo se entrega después de completar el reto.
Se conceden 100 puntos al validar la flag final. Las preguntas intermedias guardan
avance y no añaden puntos al ranking. Los dos retos son públicos dentro del
catálogo y pueden resolverse con una cuenta registrada; no conceden membresía.

Los archivos originales pertenecen a **Hack The Box** y proceden de los ZIP que
aportó el propietario del proyecto. ShadowBytes mantiene esa atribución y añade
las guías en español. No se modifica ni se incorpora el material original al
repositorio público.

## Preparar de forma reproducible

Desde la raíz del repositorio, con Python 3:

```powershell
py scripts/prepare-htb-import.py --source D:/HTB
py -m unittest discover -s tests -p test_htb_import.py
```

En macOS o Linux, usa `python3` y cambia `--source` a la carpeta que contenga los
ZIP. El importador solo lee `crypto_dynastic.zip` y `rev_lootstash.zip`, comprueba
sus miembros y tamaños, y no ejecuta `source.py` ni `stash`.

La salida se guarda en `ctf-import.local/`, ignorada por Git mediante `*.local`:

- `htb-dynastic.zip` y `htb-lootstash.zip`: copias idénticas de los ZIP originales, renombradas para el almacenamiento.
- `import.sql`: transacción idempotente del catálogo, pasos, pistas y secretos. Contiene soluciones privadas; no se debe añadir a Git.
- `answers.json`: flags y respuestas intermedias verificadas, para la comprobación administrativa local. No es contenido del frontend.
- `verification.json`: resultado de las comprobaciones estáticas. Marca explícitamente que todavía no se han aplicado cambios a Supabase ni subido objetos.

El JSON público `catalog.json` solo contiene instrucciones y metadatos. Los hashes
de validación se calculan al preparar el paquete y se escriben exclusivamente en
las tablas privadas `challenge_secrets` y `lab_step_secrets` del SQL generado.
No se exponen en las filas de `labs` ni de `lab_steps`.

## Publicación administrativa

1. Aplicar las migraciones existentes de seguridad, aprendizaje guiado y resolución del esquema de `pgcrypto`.
2. Comprobar que la política de lectura del bucket permite a usuarios registrados descargar los archivos de retos publicados que no exigen membresía. El bucket `ctf-zips` debe continuar privado.
3. Subir los dos ZIP preparados al bucket `ctf-zips` usando exactamente los nombres `htb-dynastic.zip` y `htb-lootstash.zip`.
4. Revisar y ejecutar `ctf-import.local/import.sql` en el proyecto correcto de Supabase. Solo inserta o actualiza los slugs `htb-dynastic` y `htb-lootstash`, sus pasos, pistas y secretos. Los UUID son deterministas. La transacción aborta ante conflictos de identidad; nunca borra perfiles, progreso, puntos ni retos existentes.
5. Verificar con una cuenta nueva que la descarga firmada funciona; completar las seis preguntas y enviar ambas flags desde la interfaz. Recargar entre pasos y repetir una flag correcta para comprobar que no duplica puntuación.

El importador no utiliza credenciales, no conecta con Supabase, no envía mensajes
y no despliega nada. La preparación local y la prueba real en producción son
comprobaciones distintas; no marcar el plan completo hasta confirmar ambas.

## Comprobaciones realizadas por el importador

Dynastic se resuelve con una implementación independiente después de comparar
estáticamente las funciones del archivo original con el algoritmo revisado.
El recifrado debe reproducir exactamente el mensaje original. La prueba corta
con un guion intermedio asegura que las posiciones incluyen la puntuación.

LootStash se inspecciona como bytes: firma ELF, clase del archivo y una sola
coincidencia literal de flag ASCII. Si el ZIP cambia, hay archivos adicionales,
un miembro cifrado, un tamaño inesperado o varias flags candidatas, el importador
se detiene para revisar la evidencia.

Las pruebas automatizadas usan datos sintéticos y cubren recifrado, posiciones,
normalización compatible con el servidor, ZIP inesperados, múltiples candidatas,
escapado SQL y separación de secretos respecto del catálogo público.
