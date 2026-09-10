/** Translate expected authentication failures without exposing backend details. */
export function authErrorMessage(message: string): string {
  const value = message.toLowerCase();
  if (value.includes('email not confirmed')) return 'Confirma tu correo antes de entrar. Busca el mensaje de confirmación y revisa Spam.';
  if (value.includes('invalid login credentials')) return 'El correo o la contraseña no coinciden. Revisa ambos e inténtalo de nuevo.';
  if (value.includes('rate limit') || value.includes('too many') || value.includes('after')) return 'Se alcanzó el límite temporal de intentos. Espera unos minutos antes de volver a intentarlo.';
  if (value.includes('email address') && value.includes('not authorized')) return 'El servicio de correo todavía no permite registrar esta dirección. La administración debe configurar el envío de correos.';
  if (value.includes('user already registered')) return 'Ya existe una cuenta con este correo. Usa Iniciar sesión.';
  if (value.includes('password')) return 'La contraseña no cumple los requisitos. Usa al menos 8 caracteres.';
  if (value.includes('signup') && value.includes('disabled')) return 'Los registros están cerrados temporalmente.';
  if (value.includes('fetch') || value.includes('network')) return 'No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.';
  return 'No se pudo completar el acceso. Inténtalo de nuevo; si continúa, contacta con la administración.';
}
