import { Client, Events, GatewayIntentBits } from "discord.js";
import cors from "@fastify/cors";
import { token } from "../config.json";
import { setupBotCommands } from "./setup/commands";
import { initDaggerMonitor } from "./monitors/dagger-monitor";
import { handleInteraction } from "./commands";
import { createServer } from "http";
import Fastify from "fastify";
import { ArchitectsBot } from "./types";

const setupBot = async () => {
  const bot = new Client({
    intents: [GatewayIntentBits.Guilds],
  }) as ArchitectsBot;

  setupBotCommands(bot);

  bot.on(Events.ClientReady, (readyBot) => {
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

const setupApi = async () => {
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

  fastify.get("/bot/hello", async (request, reply) => {
    return { hello: "HELLO I AM ARCBOT" };
  });

  try {
    await fastify.listen({ port: 3002 });
    console.log(`Server listening at http://localhost:${3002}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

setupBot();
setupApi();
