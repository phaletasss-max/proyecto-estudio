import {
  Client,
  GatewayIntentBits,
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
  console.log(`🤖 Bot listo como: ${client.user.tag}`);

  const guilds = await client.guilds.fetch();
  if (guilds.size === 0) {
    console.log('No se encontraron servidores.');
    process.exit(1);
  }

  const oauthGuild = guilds.first();
  const guild = await oauthGuild.fetch();
  console.log(`📌 Configurando roles interactivos en: "${guild.name}"`);

  try {
    // 1. Crear Roles de Especialidad y Notificaciones
    console.log('\n🎭 Creando roles de especialidad...');
    
    const roleDev = await guild.roles.create({
      name: '💻 Dev / Web',
      color: 0x38bdf8,
      hoist: false,
      reason: 'Rol auto-asignable para interesados en Desarrollo Web',
    });

    const roleInfra = await guild.roles.create({
      name: '🖥️ Infra / SysAdmin',
      color: 0x3b82f6,
      hoist: false,
      reason: 'Rol auto-asignable para interesados en Windows Server',
    });

    const roleCyber = await guild.roles.create({
      name: '🛡️ CyberSec / Pentester',
      color: 0xa855f7,
      hoist: false,
      reason: 'Rol auto-asignable para interesados en Ciberseguridad & CTF',
    });

    const roleAvisos = await guild.roles.create({
      name: '🔔 Notificaciones CTFs',
      color: 0xf59e0b,
      hoist: false,
      reason: 'Rol para recibir menciones en competencias y avisos',
    });

    console.log('   ✓ Roles de especialidad creados.');

    // 2. Buscar o crear el canal #roles-y-intereses
    let chanRoles = guild.channels.cache.find(c => c.name.includes('roles'));
    if (!chanRoles) {
      const catInicio = guild.channels.cache.find(c => c.name.includes('INICIO'));
      chanRoles = await guild.channels.create({
        name: '🎭-roles-e-intereses',
        type: 0, // GuildText
        parent: catInicio ? catInicio.id : undefined,
        topic: 'Elige tus especialidades y preferencias de notificación con un clic',
      });
    }

    // 3. Crear el Embed de Selección de Roles
    const embedOnboarding = new EmbedBuilder()
      .setTitle('🎯 BIENVENIDO — ELIGE TUS INTERESES Y ESPECIALIDADES')
      .setDescription(`Para personalizar tu experiencia en **ShadowBytes SENATI**, haz clic en los botones de abajo para asignarte tus roles:`)
      .setColor(0x38bdf8)
      .addFields(
        {
          name: '💻 Dev / Web',
          value: 'Interesado en HTML, CSS, React, TypeScript, Git y Vercel.',
          inline: true,
        },
        {
          name: '🖥️ Infra / SysAdmin',
          value: 'Interesado en Windows Server 2022, Active Directory, DNS, DHCP y VirtualBox.',
          inline: true,
        },
        {
          name: '🛡️ CyberSec / Pentester',
          value: 'Interesado en análisis forense, Kali Linux, Wireshark y CTFs.',
          inline: true,
        },
        {
          name: '🔔 Notificaciones CTFs',
          value: 'Recibe alertas sobre retos de ciberseguridad, fechas y avisos del grupo.',
          inline: false,
        }
      )
      .setFooter({ text: 'Puedes hacer clic de nuevo para quitar o agregar cualquier rol en cualquier momento.' });

    // 4. Crear los Botones Interactivos
    const rowButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`role_${roleDev.id}`)
        .setLabel('💻 Dev / Web')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(`role_${roleInfra.id}`)
        .setLabel('🖥️ Infra / SysAdmin')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(`role_${roleCyber.id}`)
        .setLabel('🛡️ CyberSec')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId(`role_${roleAvisos.id}`)
        .setLabel('🔔 Notificaciones')
        .setStyle(ButtonStyle.Success)
    );

    // 5. Enviar el Mensaje Interactivo
    await chanRoles.send({
      embeds: [embedOnboarding],
      components: [rowButtons],
    });

    console.log(`\n🎉 Mensaje de Onboarding e Intereses publicado en #${chanRoles.name}!`);

  } catch (err) {
    console.error('❌ Error en onboarding setup:', err);
  }
});

// Listener interactivo para cuando los miembros hacen clic en los botones
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;
  if (!customId.startsWith('role_')) return;

  const roleId = customId.replace('role_', '');
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const role = interaction.guild?.roles.cache.get(roleId);

  if (!member || !role) {
    return interaction.reply({ content: '❌ No se pudo encontrar el rol o miembro.', ephemeral: true });
  }

  try {
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
      await interaction.reply({
        content: `➖ Se te quitó el rol **${role.name}**.`,
        ephemeral: true,
      });
    } else {
      await member.roles.add(roleId);
      await interaction.reply({
        content: `➕ Se te asignó el rol **${role.name}**. ¡Bienvenido!`,
        ephemeral: true,
      });
    }
  } catch (err) {
    await interaction.reply({
      content: `❌ Error al cambiar rol. Asegúrate de que el bot tenga permisos de Administrador.`,
      ephemeral: true,
    });
  }
});

client.login(token);
