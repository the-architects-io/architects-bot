import { Client, Events, GatewayIntentBits } from "discord.js";
import { token } from "../config.json";
import { setupBotCommands } from "./setup/commands";
import { initDaggerMonitor } from "./monitors/dagger-monitor";
import { handleInteraction } from "./commands";

const setupBot = async () => {
  const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

  setupBotCommands(bot);

  bot.on(Events.ClientReady, (readyClient) => {
    initDaggerMonitor(readyClient);
  });

  bot.on(Events.InteractionCreate, async (interaction) => {
    handleInteraction(interaction, bot);
  });

  bot.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  bot.login(token);
};

setupBot();
