const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const token = 'MTUzMDk0MzcyNDYzOTc1MjMyMw.GsqZSm.E5IuZdYgP0Y-f3N-SZZ1usNg0iztb7sds5tWgs';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const channelContentMap = [
  {
    channelId: '1530947858608427010', // #🤖-noticias-ia-y-datacenters
    embed: new EmbedBuilder()
      .setTitle('🤖 Noticias IA & Megaproyectos de Data Centers (2026)')
      .setDescription(
        'Boletín actualizado sobre avances en Inteligencia Artificial, infraestructura cloud e inversiones globales en centros de datos.\n\n' +
        '🔹 **Inversión Masiva en Clústeres GPU**:\n' +
        'Empresas tecnológicas globales han expandido infraestructuras en América Latina y EE. UU. con supercomputadores basados en clústeres NVIDIA Blackwell para procesamiento masivo.\n\n' +
        '🔹 **Modelos Open Source & Inferencias Locales**:\n' +
        'El auge de arquitecturas MoE (Mixture of Experts) como DeepSeek-V3 y Llama 3.3 permite ejecutar modelos de lenguaje complejos en servidores locales con consumo optimizado de memoria VRAM.\n\n' +
        '🔹 **Automatización en Servidores & Devops**:\n' +
        'Nuevos agentes de IA integrados directamente en CLI para la auditoría de código, detección de bugs y generación de configuraciones Nginx/Docker en segundos.'
      )
      .setColor(0x38bdf8)
      .setFooter({ text: 'ShadowBytes Tech Intelligence • 4.º Ciclo' })
      .setTimestamp(),
  },
  {
    channelId: '1530947860156121263', // #🛡️-cves-y-boletines-security
    embed: new EmbedBuilder()
      .setTitle('🛡️ Boletín de Seguridad, CVEs & Vulnerabilidades Críticas')
      .setDescription(
        'Alertas de ciberseguridad, vulnerabilidades de alto impacto (CVSS 9.0+) y recomendaciones de hardening para sistemas de red.\n\n' +
        '🚨 **CVE-2024-38077 — Windows Remote Desktop Licensing RCE (CVSS 9.8)**:\n' +
        'Vulnerabilidad de ejecución remota de código en el servicio de licencias RDP de Windows Server 2022. Se recomienda aplicar el parche de seguridad acumulativo KB5040437.\n\n' +
        '🚨 **CVE-2024-1086 — Linux Kernel nftables Privilege Escalation**:\n' +
        'Escalación de privilegios local a usuario `root` debido a una falla Use-After-Free en el subsistema `nf_tables`. Afecta a núcleos Linux 5.14 a 6.6 en Ubuntu y Arch Linux.\n\n' +
        '🛡️ **Hardening Recomendado para Active Directory**:\n' +
        '• Deshabilitar autenticación NTLMv1 y priorizar Kerberos v5.\n' +
        '• Implementar políticas de contraseñas de grano fino (FGPP) en grupos privilegiados.\n' +
        '• Auditar delegaciones de Kerberos unconstrained.'
      )
      .setColor(0xef4444)
      .setFooter({ text: 'ShadowBytes Security Research • Ciberseguridad SENATI' })
      .setTimestamp(),
  },
  {
    channelId: '1530947861909606480', // #🇵🇪-ctfs-y-competencias-peru
    embed: new EmbedBuilder()
      .setTitle('🇵🇪 CTFs, Hackatones & Competencias de Ciberseguridad Perú 2026')
      .setDescription(
        'Canal dedicado a la difusión de torneos Capture The Flag (CTF), competencias interuniversitarias y retos nacionales de hacking ético.\n\n' +
        '🏆 **Próximos Torneos & Ligas CTF**:\n' +
        '• **Perú CyberSec Student CTF**: Competencia universitaria e institutos en categorías Jeopardy (Web, Forensics, Reverse, Crypto).\n' +
        '• **CTFtime Global Standings**: Participación del equipo en competencias internacionales de fin de semana.\n\n' +
        '💡 **Plataformas de Entrenamiento Recomendadas**:\n' +
        '1. **Hack The Box (HTB)**: Labs reales de penetración y máquinas activas.\n' +
        '2. **TryHackMe (THM)**: Rutas guiadas de Linux Fundamentals y SOC Level 1.\n' +
        '3. **PicoCTF**: Desafíos educativos ideales para iniciar en explotación web y criptografía.'
      )
      .setColor(0xa855f7)
      .setFooter({ text: 'ShadowBytes CTF Team • SENATI Peru' })
      .setTimestamp(),
  },
  {
    channelId: '1530946362508706017', // #🖥️-windows-server-dns-ad
    embed: new EmbedBuilder()
      .setTitle('🖥️ Laboratorio de Windows Server 2022 & Active Directory')
      .setDescription(
        'Guía rápida de comandos y administración para el módulo de servidores del 4.º ciclo SENATI.\n\n' +
        '📌 **Comandos Clave DNS & Active Directory (PowerShell)**:\n' +
        '```powershell\n' +
        '# Verificar controladores de dominio activos\n' +
        'Get-ADDomainController -Filter *\n\n' +
        '# Crear usuario con UPN y OU especificada\n' +
        'New-ADUser -Name "Estudiante Senati" -GivenName "Estudiante" -Surname "Senati" -UserPrincipalName "estudiante@senati.local" -Path "OU=Estudiantes,DC=senati,DC=local" -Enabled $true\n\n' +
        '# Consultar registros DNS en el servidor\n' +
        'Get-DnsServerResourceRecord -ZoneName "senati.local"\n' +
        '```'
      )
      .setColor(0x0284c7)
      .setFooter({ text: 'Windows Server 2022 • Infrastructure Module' })
      .setTimestamp(),
  },
  {
    channelId: '1530946364278706188', // #🌐-desarrollo-web-vercel
    embed: new EmbedBuilder()
      .setTitle('🌐 Desarrollo Web Moderno, React & Despliegue en Vercel')
      .setDescription(
        'Recursos de programación web, estructuración de componentes en React + TypeScript y despliegue continuo.\n\n' +
        '🚀 **Flujo de Trabajo Automatizado**:\n' +
        '• **Control de Versiones**: Push directo a la rama `main` de GitHub activa la build automática en Vercel.\n' +
        '• **Dominio Personalizado**: Configuración de CNAME y registros A apuntando a `76.76.21.21` con SSL gratuito automatizado.\n' +
        '• **Comandos Vercel CLI**:\n' +
        '```bash\n' +
        '# Instalar Vercel CLI\n' +
        'npm i -g vercel\n\n' +
        '# Desplegar a producción\n' +
        'vercel --prod\n' +
        '```'
      )
      .setColor(0x10b981)
      .setFooter({ text: 'Web Development Module • Vercel Deployment' })
      .setTimestamp(),
  },
  {
    channelId: '1530946359719624764', // #📢-anuncios-y-entregas
    embed: new EmbedBuilder()
      .setTitle('📢 Canales de Comunicación Oficiales & Grupo de WhatsApp')
      .setDescription(
        '¡Bienvenido al servidor oficial de **ShadowBytes SENATI**!\n\n' +
        '🔗 **Enlaces Oficiales de Acceso**:\n' +
        '• 💚 **Grupo de WhatsApp Oficial**: https://chat.whatsapp.com/GQLxp8a8dVh3c3Z6POW1CU\n' +
        '• 🟣 **Servidor de Discord**: https://discord.gg/MPRzx6UHM\n' +
        '• 🌐 **Página Web Oficial**: https://4tociclo.vercel.app\n\n' +
        '📌 Recuerda asignar tus roles de universidad e intereses en el canal <#1530946934460645547> para personalizar tu experiencia.'
      )
      .setColor(0xf59e0b)
      .setFooter({ text: 'ShadowBytes SENATI • Coordinación Oficial' })
      .setTimestamp(),
  },
];

client.once('ready', async () => {
  console.log(`[Publish Content Script] Connected as ${client.user.tag}`);

  for (const item of channelContentMap) {
    try {
      const channel = await client.channels.fetch(item.channelId);
      if (channel && 'send' in channel) {
        await channel.send({ embeds: [item.embed] });
        console.log(`[OK] Sent announcement to channel: ${channel.name}`);
      }
    } catch (err) {
      console.error(`[ERROR] Could not send to channel ${item.channelId}:`, err.message);
    }
  }

  console.log('[Publish Content Script] Finished publishing all embeds.');
  process.exit(0);
});

client.login(token).catch((err) => {
  console.error('[Publish Content Script] Login failed:', err);
  process.exit(1);
});
