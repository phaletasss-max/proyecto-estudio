import { Client, GatewayIntentBits } from 'discord.js';

const token = 'MTUzMDk0MzcyNDYzOTc1MjMyMw.GsqZSm.E5IuZdYgP0Y-f3N-SZZ1usNg0iztb7sds5tWgs';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`✅ Bot conectado exitosamente como ${client.user?.tag}!`);
  const guilds = await client.guilds.fetch();
  console.log(`📌 El bot está actualmente en ${guilds.size} servidores:`);
  
  for (const [id, oauthGuild] of guilds) {
    const guild = await oauthGuild.fetch();
    console.log(` • Servidor: ${guild.name} (ID: ${guild.id}, Miembros: ${guild.memberCount})`);
  }
  
  process.exit(0);
});

client.login(token).catch((err) => {
  console.error(`❌ Error al conectar el bot: ${err.message}`);
  process.exit(1);
});
