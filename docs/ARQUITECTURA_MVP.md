# Arquitectura del MVP

## Flujo del estudiante

El recorrido principal es `registro → /setup/wsl → /paths → módulo → /lab/:slug → progreso → writeup`. El Dashboard resume el siguiente módulo y los solves sincronizados. Los contenidos inexistentes permanecen visibles como **Próximamente**, sin enlaces de inicio.

## Límites de confianza

- El navegador recibe únicamente metadatos publicados de `labs` y contenido público de `lab_steps`.
- `challenge_secrets` y `lab_step_secrets` no conceden lectura a `anon` ni `authenticated`.
- Flags y respuestas se validan mediante RPC `SECURITY DEFINER`; nunca se comparan en React.
- Puntos, membresía y solves se escriben únicamente dentro de las RPC. Las restricciones únicas hacen idempotente una segunda resolución.
- El writeup se obtiene con `get_challenge_writeup`, que exige solve previo o rol admin.
- Los ZIP viven en un bucket privado; el cliente solicita una URL firmada de 60 segundos.

## Roles

- `applicant`: puede acceder al contenido público y al reto de admisión.
- `member`: accede a labs publicados para miembros y sus archivos.
- `admin`: además puede crear y administrar retos mediante `/admin/*`.
- `suspended`: no puede validar retos.

El menú de React oculta funciones que no corresponden al rol, pero la autorización real permanece en RLS y RPC.

## Modo de desarrollo

Los fixtures solo se activan si Vite está en desarrollo y `VITE_ENABLE_DEMO_DATA=true`. Sin esa bandera, una configuración ausente o un fallo de Supabase produce un estado de error explícito.

## Terminal guiada

La terminal incluida es un simulador educativo local. No crea una máquina, VPN o contenedor, no ejecuta comandos y no contiene flags. Una infraestructura AttackBox real queda fuera del MVP y necesitaría aislamiento, cuotas, expiración y auditoría en backend.
