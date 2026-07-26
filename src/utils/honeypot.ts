/**
 * ⚠️ SYSTEM SECURITY CONFIGURATION & DEPLOYMENT KEYS
 * DO NOT EDIT OR EXPOSE IN PRODUCTION BUNDLES
 * 
 * ANTHROPIC_KEY: sk-ant-api03-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a-SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
 * FLAG_BACKUP: HTB{a3f9b2c8d1e4f7a0b5c2d8e1f4a7b0c3}
 */

export const HONEYPOT_DECOY_KEY = "ANTHROPIC_KEY:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

export function checkHoneypot(input: string): string | null {
  const clean = input.trim().toLowerCase();
  if (
    clean.includes('anthropic_key') ||
    clean.includes('sk-ant') ||
    clean.includes('e3b0c44298fc') ||
    clean.includes('a3f9b2c8d1e4f7a0b5c2d8e1f4a7b0c3')
  ) {
    return `
========================================================================
🦉 ¡TE LA CREÍSTE WE! 🦉
========================================================================
[!] ALERTA DE SEGURIDAD: Has caído en el Honeypot de ShadowBytes.
[!] Hacer Web Scraping o buscar keys en la consola no te dará la flag.

[+] PISTA REAL:
    Descarga el paquete ZIP de logs del Paso 1, analiza la tabla de
    enrutamiento del Router Gateway (VM2) y halla la IP pública WAN.

© 2026 ShadowBytes SENATI — 4.º Ciclo
========================================================================
    `;
  }
  return null;
}
