import { FastifyInstance } from "fastify";
import { ArchitectsBot } from "../types";
import { SYSTEM_ERRORS_CHANNEL_ID } from "../constants/channels";
import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { TextChannel } from "discord.js";
import { AxiosError } from "axios";

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

    const { error, metadata } = request.body as unknown as {
      // errorResponse = error?.response?.data?.error;

      error:
        | Error
        | (AxiosError extends { response: { data: { error: infer E } } }
            ? E
            : never);
      metadata: {
        context: string;
      } & Record<string, string>;
    };

    const fields = [
      { name: "Error", value: error.message },
      { name: "Message", value: metadata?.message },
      { name: "Context", value: metadata?.context },
    ];

    console.log("in bot", {
      error,
      metadata,
    });
    console.log("error instanceof AxiosError", error instanceof AxiosError);

    // @ts-ignore
    if (!!error?.config?.url) {
      // @ts-ignore
      fields.push({ name: "URL", value: error.config.url });
    }
    // @ts-ignore
    if (!!error?.code) {
      // @ts-ignore
      fields.push({ name: "Code", value: error.code });
    }

    const embed = new EmbedBuilder()
      .setTitle("System Error")
      .addFields([{ name: "\u200B", value: "\u200B" }, ...fields])
      .setDescription(
        `
\`\`\`
${JSON.stringify(metadata.rawError, null, 2)}
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
