import { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } from 'discord.js';

const token = 'MTUzMDk0MzcyNDYzOTc1MjMyMw.GsqZSm.E5IuZdYgP0Y-f3N-SZZ1usNg0iztb7sds5tWgs';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log(`====================================================`);
  console.log(`🤖 ShadowBytes-Bot conectado como: ${client.user.tag}`);
  console.log(`====================================================`);

  const guilds = await client.guilds.fetch();

  if (guilds.size === 0) {
    console.log(`⚠️  EL BOT AÚN NO ESTÁ EN NINGÚN SERVIDOR DE DISCORD.`);
    console.log(`👉 Entra a este link en tu navegador para invitarlo a tu servidor:`);
    console.log(`https://discord.com/api/oauth2/authorize?client_id=1530943724639752323&permissions=8&scope=bot%20applications.commands`);
    process.exit(0);
  }

  const oauthGuild = guilds.first();
  const guild = await oauthGuild.fetch();
  console.log(`📌 Configurando el servidor: "${guild.name}" (ID: ${guild.id})`);

  try {
    // 1. Crear Roles
    console.log(`\n🎭 1. Creando Roles...`);
    const roleInstructor = await guild.roles.create({
      name: 'Instructor',
      color: 0xf59e0b, // Amber
      hoist: true,
      reason: 'Rol para el instructor del curso',
    });
    console.log(`   ✓ Rol 'Instructor' creado.`);

    const roleCoordinador = await guild.roles.create({
      name: 'Coordinador',
      color: 0x3b82f6, // Blue
      hoist: true,
      reason: 'Rol para los coordinadores del grupo',
    });
    console.log(`   ✓ Rol 'Coordinador' creado.`);

    const roleEstudiante = await guild.roles.create({
      name: 'Estudiante SENATI',
      color: 0x22d3ee, // Cyan
      hoist: true,
      reason: 'Rol principal para los miembros del grupo',
    });
    console.log(`   ✓ Rol 'Estudiante SENATI' creado.`);

    // 2. Crear Categoría: INICIO & REGLAS
    console.log(`\n📁 2. Creando Categoría: INICIO & REGLAS...`);
    const catInicio = await guild.channels.create({
      name: '📋 INICIO & REGLAS',
      type: ChannelType.GuildCategory,
    });

    const chanReglas = await guild.channels.create({
      name: '📜-reglas-y-bienvenida',
      type: ChannelType.GuildText,
      parent: catInicio.id,
      topic: 'Reglas oficiales y filosofía del grupo de estudio ShadowBytes SENATI',
    });
    console.log(`   ✓ Canal '#reglas-y-bienvenida' creado.`);

    const chanAnuncios = await guild.channels.create({
      name: '📢-anuncios-y-entregas',
      type: ChannelType.GuildText,
      parent: catInicio.id,
      topic: 'Avisos importantes del 4.º ciclo y fechas de laboratorio',
    });
    console.log(`   ✓ Canal '#anuncios-y-entregas' creado.`);

    // 3. Crear Categoría: CURSOS & MODULOS
    console.log(`\n📁 3. Creando Categoría: CURSOS & MODULOS...`);
    const catCursos = await guild.channels.create({
      name: '📚 CURSOS & MODULOS (4.º CICLO)',
      type: ChannelType.GuildCategory,
    });

    await guild.channels.create({
      name: '🖥️-windows-server-dns-ad',
      type: ChannelType.GuildText,
      parent: catCursos.id,
      topic: 'Consultas sobre Windows Server 2022, DNS, DHCP, Active Directory y IIS',
    });

    await guild.channels.create({
      name: '🌐-desarrollo-web-vercel',
      type: ChannelType.GuildText,
      parent: catCursos.id,
      topic: 'Consultas sobre HTML, CSS, React, Git, GitHub y Vercel',
    });

    await guild.channels.create({
      name: '🏆-ctf-y-ciberseguridad',
      type: ChannelType.GuildText,
      parent: catCursos.id,
      topic: 'Retos de Capture The Flag, Kali Linux, Wireshark y pentesting ético',
    });
    console.log(`   ✓ Canales de materias creados.`);

    // 4. Crear Categoría: COMUNIDAD
    console.log(`\n📁 4. Creando Categoría: COMUNIDAD & CONSULTAS...`);
    const catComunidad = await guild.channels.create({
      name: '💬 COMUNIDAD & CONSULTAS',
      type: ChannelType.GuildCategory,
    });

    await guild.channels.create({
      name: '❓-dudas-laboratorios',
      type: ChannelType.GuildText,
      parent: catComunidad.id,
      topic: 'Preguntas rápidas y ayuda entre compañeros',
    });

    await guild.channels.create({
      name: '🔗-recursos-y-programas',
      type: ChannelType.GuildText,
      parent: catComunidad.id,
      topic: 'Enlaces a herramientas, ISOs de VirtualBox y documentación',
    });

    await guild.channels.create({
      name: '💬-chat-general',
      type: ChannelType.GuildText,
      parent: catComunidad.id,
      topic: 'Charla libre entre los integrantes del grupo',
    });

    // 5. Crear Categoría: SALAS DE VOZ
    console.log(`\n📁 5. Creando Salas de Voz...`);
    const catVoz = await guild.channels.create({
      name: '🔊 SALAS DE VOZ & ESTUDIO',
      type: ChannelType.GuildCategory,
    });

    await guild.channels.create({
      name: '🎧 Estudio Nocturno 1',
      type: ChannelType.GuildVoice,
      parent: catVoz.id,
    });

    await guild.channels.create({
      name: '🎧 Estudio Nocturno 2',
      type: ChannelType.GuildVoice,
      parent: catVoz.id,
    });

    await guild.channels.create({
      name: '💻 Lab Windows Server & Web',
      type: ChannelType.GuildVoice,
      parent: catVoz.id,
    });

    // 6. Publicar Mensaje de Reglas y Bienvenida
    console.log(`\n📜 6. Publicando Mensaje de Reglas en #reglas-y-bienvenida...`);
    await chanReglas.send({
      embeds: [
        {
          title: '⚡ REGLAS OFICIALES & BIENVENIDA — SHADOWBYTES SENATI',
          description: `¡Bienvenidos al servidor oficial del grupo de estudio para el **4.º Ciclo de SENATI**!
Este es un espacio colaborativo enfocado en aprender juntos, resolver laboratorios y apoyarnos mutuamente.`,
          color: 0x38bdf8,
          fields: [
            {
              name: '📜 1. Filosofía del Grupo',
              value: '• *"No tengas miedo de empezar sin saber; ten miedo de saber que no sabes y aun así no hacer nada para aprender."*\n• Aquí todos aprendemos desde cero. No hay preguntas tontas.',
            },
            {
              name: '🤝 2. Respeto y Colaboración (Max 10 Integrantes)',
              value: '• Trato respetuoso entre todos los compañeros e instructor.\n• Compartir conocimientos, enlaces útiles y código sin egoísmos.',
            },
            {
              name: '💻 3. Organización por Canales',
              value: '• Usar los canales temáticos para mantener el orden (Windows Server, Web, CTFs, Recursos).\n• Para consultas en llamadas, usar las salas de **Estudio Nocturno**.',
            },
            {
              name: '👨‍🏫 4. Créditos Académicos',
              value: '• **Curso**: 4.º Ciclo SENATI\n• **Instructor**: Victor Kenky Rodriguez Lopez\n• **Comunidad**: ShadowBytes SENATI',
            },
          ],
          footer: {
            text: '© 2026 ShadowBytes SENATI • Grupo de Estudio Colaborativo',
          },
        },
      ],
    });

    console.log(`\n====================================================`);
    console.log(`🎉 ¡CONFIGURACIÓN DEL SERVIDOR COMPLETADA CON ÉXITO!`);
    console.log(`====================================================`);

    process.exit(0);
  } catch (err) {
    console.error(`❌ Error durante la configuración del servidor:`, err);
    process.exit(1);
  }
});

client.login(token).catch((err) => {
  console.error(`❌ Error al conectar el bot:`, err.message);
  process.exit(1);
});
