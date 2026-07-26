import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  Client,
  GatewayIntentBits,
  ChannelType,
  ColorResolvable,
  TextChannel,
  NewsChannel,
  ThreadChannel,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("ERROR: DISCORD_TOKEN environment variable is missing.");
  process.exit(1);
}

// Initialize Discord Client
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let isReady = false;

discordClient.once("ready", (c) => {
  console.error(`[Discord MCP Node] Logged in as ${c.user.tag}`);
  isReady = true;
});

// Listener for Interactive Self-Assign Role Buttons & University Select Menu
discordClient.on("interactionCreate", async (interaction) => {
  // 1. Handle Button Clicks
  if (interaction.isButton()) {
    const customId = interaction.customId;
    if (!customId.startsWith("role_")) return;

    // Defer reply immediately so Discord NEVER shows "No ha respondido a tiempo"
    await interaction.deferReply({ flags: 64 });

    const roleId = customId.replace("role_", "");
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const role = interaction.guild?.roles.cache.get(roleId);

    if (!member || !role) {
      return interaction.editReply({ content: "❌ No se pudo encontrar el rol o miembro." });
    }

    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        await interaction.editReply({ content: `➖ Se te quitó el rol **${role.name}**.` });
      } else {
        await member.roles.add(roleId);
        await interaction.editReply({ content: `➕ Se te asignó el rol **${role.name}**. ¡Bienvenido!` });
      }
    } catch (err) {
      await interaction.editReply({ content: `❌ Error al cambiar rol. Verifica los permisos del bot.` });
    }
    return;
  }

  // 2. Handle University String Select Menu
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId !== "select_university") return;

    await interaction.deferReply({ flags: 64 });

    const selectedValue = interaction.values[0]; // e.g. unirole_123456789
    const roleId = selectedValue.replace("unirole_", "");
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const role = interaction.guild?.roles.cache.get(roleId);

    if (!member || !role) {
      return interaction.editReply({ content: "❌ No se pudo encontrar el rol universitario." });
    }

    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        await interaction.editReply({ content: `➖ Se te quitó el rol **${role.name}**.` });
      } else {
        await member.roles.add(roleId);
        await interaction.editReply({ content: `➕ Se te asignó el rol **${role.name}**.` });
      }
    } catch (err) {
      await interaction.editReply({ content: `❌ Error al asignar rol universitario.` });
    }
  }
});

discordClient.login(token).catch((err) => {
  console.error(`[Discord MCP Node] Login failed: ${err.message}`);
  process.exit(1);
});

// Helper to get first guild or by guild_id
async function getGuild(guildId?: string) {
  if (!isReady) {
    throw new Error("Discord bot is still logging in. Please try again in a few seconds.");
  }
  if (guildId) {
    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) throw new Error(`Guild with ID ${guildId} not found.`);
    return guild;
  }
  const guilds = await discordClient.guilds.fetch();
  const first = guilds.first();
  if (!first) throw new Error("Bot is not in any Discord server. Please invite the bot first.");
  return await first.fetch();
}

// Create MCP Server
const server = new Server(
  {
    name: "discord-mcp-node",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "discord_create_category",
        description: "Create a new channel category in the Discord server",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the category" },
            guild_id: { type: "string", description: "Optional Discord Server ID" },
          },
          required: ["name"],
        },
      },
      {
        name: "discord_create_channel",
        description: "Create a text or voice channel in the Discord server",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the channel" },
            type: { type: "string", enum: ["text", "voice"], description: "Type of channel ('text' or 'voice')" },
            category_id: { type: "string", description: "Optional Category ID" },
            topic: { type: "string", description: "Optional channel topic" },
            guild_id: { type: "string", description: "Optional Discord Server ID" },
          },
          required: ["name", "type"],
        },
      },
      {
        name: "discord_create_role",
        description: "Create a new role with custom name, color and permissions",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the role" },
            color: { type: "string", description: "Hex color code" },
            hoist: { type: "boolean", description: "Display role members separately" },
            guild_id: { type: "string", description: "Optional Discord Server ID" },
          },
          required: ["name"],
        },
      },
      {
        name: "discord_send_message",
        description: "Send a message or embed to a text channel in Discord",
        inputSchema: {
          type: "object",
          properties: {
            channel_id: { type: "string", description: "ID of the text channel" },
            content: { type: "string", description: "Text content" },
            title: { type: "string", description: "Optional title for embed box" },
          },
          required: ["channel_id", "content"],
        },
      },
      {
        name: "discord_list_channels",
        description: "List all channels and categories in the Discord server",
        inputSchema: {
          type: "object",
          properties: {
            guild_id: { type: "string", description: "Optional Discord Server ID" },
          },
        },
      },
      {
        name: "discord_list_roles",
        description: "List all roles in the Discord server",
        inputSchema: {
          type: "object",
          properties: {
            guild_id: { type: "string", description: "Optional Discord Server ID" },
          },
        },
      },
      {
        name: "discord_get_server_info",
        description: "Get general info, member count, and owner of the Discord server",
        inputSchema: {
          type: "object",
          properties: {
            guild_id: { type: "string", description: "Optional Discord Server ID" },
          },
        },
      },
    ],
  };
});

// Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "discord_create_category") {
      const { name: catName, guild_id } = args as { name: string; guild_id?: string };
      const guild = await getGuild(guild_id);
      const category = await guild.channels.create({
        name: catName,
        type: ChannelType.GuildCategory,
      });
      return {
        content: [
          {
            type: "text",
            text: `✅ Category created successfully:\n• Name: ${category.name}\n• ID: \`${category.id}\``,
          },
        ],
      };
    }

    if (name === "discord_create_channel") {
      const { name: chanName, type, category_id, topic, guild_id } = args as {
        name: string;
        type: "text" | "voice";
        category_id?: string;
        topic?: string;
        guild_id?: string;
      };
      const guild = await getGuild(guild_id);
      const channel = await guild.channels.create({
        name: chanName,
        type: type === "voice" ? ChannelType.GuildVoice : ChannelType.GuildText,
        parent: category_id,
        topic: topic,
      });
      return {
        content: [
          {
            type: "text",
            text: `✅ Channel created successfully:\n• Name: #${channel.name}\n• Type: ${type}\n• ID: \`${channel.id}\``,
          },
        ],
      };
    }

    if (name === "discord_create_role") {
      const { name: roleName, color, hoist, guild_id } = args as {
        name: string;
        color?: string;
        hoist?: boolean;
        guild_id?: string;
      };
      const guild = await getGuild(guild_id);
      const role = await guild.roles.create({
        name: roleName,
        color: (color as ColorResolvable) || "Blue",
        hoist: hoist ?? true,
      });
      return {
        content: [
          {
            type: "text",
            text: `✅ Role created successfully:\n• Name: ${role.name}\n• ID: \`${role.id}\``,
          },
        ],
      };
    }

    if (name === "discord_send_message") {
      const { channel_id, content, title } = args as {
        channel_id: string;
        content: string;
        title?: string;
      };
      const channel = await discordClient.channels.fetch(channel_id);
      if (!channel || !('send' in channel)) {
        throw new Error(`Channel ID ${channel_id} is invalid or does not support sending messages.`);
      }

      const target = channel as TextChannel | NewsChannel | ThreadChannel;

      if (title) {
        await target.send({
          embeds: [
            {
              title: title,
              description: content,
              color: 0x38bdf8,
              footer: { text: "ShadowBytes SENATI • Discord Bot" },
            },
          ],
        });
      } else {
        await target.send(content);
      }

      return {
        content: [
          {
            type: "text",
            text: `✅ Message sent to channel <#${channel_id}> successfully.`,
          },
        ],
      };
    }

    if (name === "discord_list_channels") {
      const { guild_id } = args as { guild_id?: string };
      const guild = await getGuild(guild_id);
      const channels = await guild.channels.fetch();

      const categories = channels.filter((c) => c && c.type === ChannelType.GuildCategory);
      const textChannels = channels.filter((c) => c && c.type === ChannelType.GuildText);

      let output = `📊 **Channels in ${guild.name} (${channels.size} total):**\n\n`;

      categories.forEach((cat) => {
        output += `📁 **${cat?.name}** (ID: \`${cat?.id}\`)\n`;
        const children = textChannels.filter((c) => c?.parentId === cat?.id);
        children.forEach((child) => {
          output += `   └─ 💬 #${child?.name} (ID: \`${child?.id}\`)\n`;
        });
      });

      return {
        content: [{ type: "text", text: output }],
      };
    }

    if (name === "discord_list_roles") {
      const { guild_id } = args as { guild_id?: string };
      const guild = await getGuild(guild_id);
      const roles = await guild.roles.fetch();

      let output = `🎭 **Roles in ${guild.name} (${roles.size} total):**\n\n`;
      roles.forEach((r) => {
        output += `• **${r.name}** | ID: \`${r.id}\` | Members: ${r.members.size}\n`;
      });

      return {
        content: [{ type: "text", text: output }],
      };
    }

    if (name === "discord_get_server_info") {
      const { guild_id } = args as { guild_id?: string };
      const guild = await getGuild(guild_id);
      const owner = await guild.fetchOwner();

      const output = `⚡ **Discord Server Info:**
• **Server Name:** ${guild.name}
• **Server ID:** \`${guild.id}\`
• **Owner:** ${owner.user.tag}
• **Total Members:** ${guild.memberCount}
• **Roles:** ${guild.roles.cache.size}`;

      return {
        content: [{ type: "text", text: output }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `❌ Error: ${err.message}` }],
    };
  }
});

// Start Stdio Transport for MCP
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[Discord MCP Node] Server running on stdio transport");
}

main().catch((err) => {
  console.error("[Discord MCP Node] Fatal error:", err);
  process.exit(1);
});
