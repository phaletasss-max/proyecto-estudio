/** Generic feedback for users who paste credential-like strings into demo inputs. */
export function checkHoneypot(input: string): string | null {
  const clean = input.trim().toLowerCase();
  if (!clean.includes('api_key') && !clean.includes('secret_key')) return null;
  return 'Las credenciales no son respuestas válidas. No pegues secretos en formularios o consolas educativas.';
}
