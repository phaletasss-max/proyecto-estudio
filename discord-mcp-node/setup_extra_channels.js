import {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

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
  console.log(`🤖 Bot conectado como: ${client.user.tag}`);

  const guilds = await client.guilds.fetch();
  if (guilds.size === 0) {
    console.log('No se encontraron servidores.');
    process.exit(1);
  }

  const oauthGuild = guilds.first();
  const guild = await oauthGuild.fetch();
  console.log(`📌 Actualizando roles e institucionales en: "${guild.name}"`);

  try {
    // 1. Crear / Verificar Rol "Invitado / Externo"
    console.log('\n🎭 Creando rol "Invitado / Externo"...');
    let roleInvitado = guild.roles.cache.find(r => r.name.includes('Invitado'));
    if (!roleInvitado) {
      roleInvitado = await guild.roles.create({
        name: '🌐 Invitado / Externo',
        color: 0x94a3b8, // Slate
        hoist: true,
        reason: 'Rol para miembros externos que no pertenecen a SENATI',
      });
    }
    console.log(`   ✓ Rol 'Invitado / Externo' listo.`);

    // Asegurar que exista el rol "Estudiante SENATI"
    let roleSenati = guild.roles.cache.find(r => r.name.includes('SENATI'));
    if (!roleSenati) {
      roleSenati = await guild.roles.create({
        name: '🎓 Estudiante SENATI',
        color: 0x22d3ee, // Cyan
        hoist: true,
        reason: 'Rol para alumnos oficiales de SENATI',
      });
    }

    // 2. Crear Categoría: NOTICIAS & TENDENCIAS TECH
    console.log('\n📁 Creando Categoría: NOTICIAS & TENDENCIAS TECH...');
    const catNoticias = await guild.channels.create({
      name: '📰 NOTICIAS & TENDENCIAS TECH',
      type: ChannelType.GuildCategory,
    });

    const chanIA = await guild.channels.create({
      name: '🤖-noticias-ia-y-datacenters',
      type: ChannelType.GuildText,
      parent: catNoticias.id,
      topic: 'Lanzamientos de Inteligencia Artificial, nuevos modelos, GPU clusters e inversiones en Data Centers',
    });

    const chanCVE = await guild.channels.create({
      name: '🛡️-cves-y-boletines-security',
      type: ChannelType.GuildText,
      parent: catNoticias.id,
      topic: 'Nuevas vulnerabilidades reportadas (CVEs), parches de seguridad y Zero-Days',
    });

    const chanPeruCTF = await guild.channels.create({
      name: '🇵🇪-ctfs-y-competencias-peru',
      type: ChannelType.GuildText,
      parent: catNoticias.id,
      topic: 'Competencias de Hacking Ético, CTFs y Hackatones donde participan equipos peruanos',
    });

    console.log('   ✓ Canales de Noticias e IAs creados.');

    // 3. Publicar mensajes iniciales en los nuevos canales
    await chanIA.send({
      embeds: [
        {
          title: '🤖 NOTICIAS DE INTELIGENCIA ARTIFICIAL & DATA CENTERS',
          description: 'Espacio dedicado a compartir novedades de modelos de IA (Claude, Gemini, OpenAI), infraestructura de servidores y tendencias en Data Centers.',
          color: 0x38bdf8,
          footer: { text: 'ShadowBytes SENATI • Noticias Tech' },
        },
      ],
    });

    await chanCVE.send({
      embeds: [
        {
          title: '🛡️ ALERTAS DE VULNERABILIDADES (CVEs)',
          description: 'Reportes de fallos de seguridad recientes en sistemas operados (Windows Server, Linux, servicios Web y Redes).',
          color: 0xef4444,
          footer: { text: 'ShadowBytes SENATI • Ciberseguridad' },
        },
      ],
    });

    await chanPeruCTF.send({
      embeds: [
        {
          title: '🇵🇪 HACKING ÉTICO & CTFs — COMUNIDAD PERUANA',
          description: 'Anuncios de competencias de ciberseguridad locales e internacionales con presencia de la bandera peruana.',
          color: 0xf59e0b,
          footer: { text: 'ShadowBytes SENATI • Competencias' },
        },
      ],
    });

    // 4. Actualizar el panel de roles en #roles-e-intereses
    let chanRoles = guild.channels.cache.find(c => c.name.includes('roles'));
    if (chanRoles) {
      const embedIdentidad = new EmbedBuilder()
        .setTitle('🆔 VERIFICACIÓN DE INSTITUCIÓN & ROLES')
        .setDescription('Elige si perteneces a **SENATI** o si te unes como **Invitado Externo**, y selecciona tus materias de interés:')
        .setColor(0x38bdf8)
        .addFields(
          {
            name: '🎓 Estudiante SENATI',
            value: 'Para alumnos de la institución SENATI.',
            inline: true,
          },
          {
            name: '🌐 Invitado / Externo',
            value: 'Para compañeros e invitados de otras instituciones.',
            inline: true,
          }
        );

      const rowInstitucional = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`role_${roleSenati.id}`)
          .setLabel('🎓 Soy de SENATI')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`role_${roleInvitado.id}`)
          .setLabel('🌐 Soy Invitado / Externo')
          .setStyle(ButtonStyle.Secondary)
      );

      await chanRoles.send({
        embeds: [embedIdentidad],
        components: [rowInstitucional],
      });
    }

    console.log('\n====================================================');
    console.log('🎉 ¡CANALES DE NOTICIAS Y ROL INVITADO CREADOS CON ÉXITO!');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en actualización:', err);
    process.exit(1);
  }
});

client.login(token);
