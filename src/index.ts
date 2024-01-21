import { Client, Events, GatewayIntentBits } from "discord.js";
import cors from "@fastify/cors";
import { token } from "../config.json";
import { setupBotCommands } from "./setup/commands";
import { initDaggerMonitor } from "./monitors/dagger-monitor";
import { handleInteraction } from "./commands";
import { createServer } from "http";
import Fastify from "fastify";
import { ArchitectsBot } from "./types";
import { setupApiEndpoints } from "./api";

const setupApi = async (bot?: ArchitectsBot) => {
  const httpServer = createServer();
  const fastify = Fastify({
    logger: true,
    bodyLimit: 10 * 1024 * 1024,
    serverFactory: (handler) => {
      httpServer.on("request", (req, res) => {
        handler(req, res);
      });
      return httpServer;
    },
  });

  await fastify.register(cors, {
    origin: "*",
  });

  setupApiEndpoints(fastify);

  try {
    await fastify.listen({ port: 3002 });
    console.log(`Server listening at http://localhost:${3002}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const setupBot = async () => {
  const bot = new Client({
    intents: [GatewayIntentBits.Guilds],
  }) as ArchitectsBot;

  setupBotCommands(bot);

  bot.on(Events.ClientReady, (readyBot) => {
    setupApi(readyBot as ArchitectsBot);
    initDaggerMonitor(readyBot);
  });

  bot.on(Events.InteractionCreate, async (interaction) => {
    handleInteraction(interaction, bot);
  });

  bot.once(Events.ClientReady, (readyBot) => {
    console.log(`Ready! Logged in as ${readyBot.user.tag}`);
  });

  bot.login(token);
};

setupApi();
setupBot();
