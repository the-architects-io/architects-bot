import { FastifyInstance } from "fastify";
import { ArchitectsBot } from "../types";
import { SYSTEM_ERRORS_CHANNEL_ID } from "../constants/channels";
import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { TextChannel } from "discord.js";

export const setupApiEndpoints = (
  fastify: FastifyInstance,
  bot: ArchitectsBot,
) => {
  fastify.get("/bot/hello", async (request, reply) => {
    return { greeting: "HELLO I AM ARCBOT" };
  });

  fastify.post("/bot/report-error", async (request, reply) => {
    const channel = bot.channels.cache.get(SYSTEM_ERRORS_CHANNEL_ID);

    if (!channel || !(channel instanceof TextChannel)) {
      console.error("Channel not found or it is not a text channel.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("System Error")
      .setDescription(
        `
\`\`\`  
${JSON.stringify(request.body, null, 2)}
\`\`\`
      `,
      )
      .setFooter({
        text: "Error occurred " + dayjs().format("MM-DD-YY @ HH:mm:ss"),
      })
      .setColor(0xff5733);

    await channel.send({ embeds: [embed] });
  });
};
