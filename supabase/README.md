# Supabase: retos, flags y admisión

## Aplicación segura

1. Si es una base nueva, ejecuta primero [`schema.sql`](./schema.sql) y después [`migrations/20260831_secure_ctf_admission.sql`](./migrations/20260831_secure_ctf_admission.sql) en el SQL Editor. Si la base ya tiene las tablas originales, ejecuta únicamente la migración.
2. Crea o inicia sesión con la cuenta de la persona administradora. Copia su UUID desde **Authentication → Users** y ejecuta la última sentencia `update` comentada en la migración para promoverla a `admin`.
3. En el proyecto web crea `.env.local` a partir de `.env.example` y agrega solo la URL del proyecto y la **Publishable key**. No pongas jamás una `service_role` ni una `sb_secret_` en Vite, Git o Vercel.
4. En **Storage**, crea el bucket `ctf-zips`. Puede ser público si los archivos de los retos son descargables; nunca incluyas flags o soluciones dentro de esos ZIPs.
5. Como admin, usa la pantalla **Subir** para crear el CTF de admisión. Marca `Reto de admisión` y deja activado `Solo miembros`; el sistema lo vuelve visible para postulantes y, al resolverlo, cambia su estado a `member`.
6. Publica el reto desde Supabase: `update public.labs set is_published = true where slug = 'tu-slug';`.

## Qué protege esta migración

- La flag y el writeup se mueven a `challenge_secrets`, una tabla que el navegador no puede leer.
- `submit_flag` comprueba la respuesta y acredita puntos dentro de una sola transacción.
- Los usuarios ya no pueden actualizar puntos, rango, membresía ni insertar solves directamente.
- Un solve correcto en un reto marcado como admisión transforma a un `applicant` en `member`.

El frontend únicamente usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`; ambas son configuraciones públicas por diseño. La protección real está en las políticas RLS y en las RPC de la migración.
