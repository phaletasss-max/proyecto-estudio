import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
} from 'discord.js';

const token = 'MTUzMDk0MzcyNDYzOTc1MjMyMw.GsqZSm.E5IuZdYgP0Y-f3N-SZZ1usNg0iztb7sds5tWgs';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Bot conectado como: ${client.user.tag}`);

  const guilds = await client.guilds.fetch();
  if (guilds.size === 0) process.exit(1);

  const oauthGuild = guilds.first();
  const guild = await oauthGuild.fetch();
  console.log(`📌 Agregando roles universitarios en: "${guild.name}"`);

  try {
    // 1. Lista de Universidades e Institutos
    const unis = [
      { name: '🏛️ UNI (Ingeniería)', color: 0x990000, idName: 'UNI' },
      { name: '🏛️ UNMSM (San Marcos)', color: 0x003366, idName: 'UNMSM' },
      { name: '🏢 UTP', color: 0xe11d48, idName: 'UTP' },
      { name: '🏛️ PUCP', color: 0x1e3a8a, idName: 'PUCP' },
      { name: '💻 Cibertec', color: 0x0284c7, idName: 'Cibertec' },
      { name: '🌐 Otra Universidad / Instituto', color: 0x64748b, idName: 'OtraUni' },
    ];

    const createdRoles = {};

    console.log('\n🎭 Creando roles de universidades...');
    for (const u of unis) {
      let role = guild.roles.cache.find(r => r.name.includes(u.idName));
      if (!role) {
        role = await guild.roles.create({
          name: u.name,
          color: u.color,
          hoist: false,
          reason: 'Rol de institución para invitados',
        });
      }
      createdRoles[u.idName] = role.id;
      console.log(`   ✓ Rol '${u.name}' listo.`);
    }

    // 2. Publicar Menú Desplegable (Select Menu) en #roles-e-intereses
    let chanRoles = guild.channels.cache.find(c => c.name.includes('roles'));
    if (chanRoles) {
      const embedUni = new EmbedBuilder()
        .setTitle('🏛️ SELECCIONA TU UNIVERSIDAD O INSTITUTO')
        .setDescription('Si eres un invitado externo, selecciona tu casa de estudios para asignarte el rol correspondiente en el servidor:')
        .setColor(0x3b82f6)
        .addFields(
          { name: 'Opciones', value: '• UNI\n• UNMSM\n• UTP\n• PUCP\n• Cibertec\n• Otra institución', inline: true }
        );

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select_university')
        .setPlaceholder('Elige tu Universidad / Instituto...')
        .addOptions(
          unis.map(u => ({
            label: u.name,
            value: `unirole_${createdRoles[u.idName]}`,
            description: `Asignar rol de ${u.name}`,
          }))
        );

      const rowSelect = new ActionRowBuilder().addComponents(selectMenu);

      await chanRoles.send({
        embeds: [embedUni],
        components: [rowSelect],
      });
      console.log('   ✓ Menú desplegable de Universidades publicado en Discord.');
    }

    console.log('\n🎉 ¡ROLES DE UNIVERSIDADES CREADOS EXITOSAMENTE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
});

client.login(token);
