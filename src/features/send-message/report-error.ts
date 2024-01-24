import { ArchitectsBot } from "../../types";
import { SYSTEM_ERRORS_CHANNEL_ID } from "../../constants";
import { TextChannel } from "discord.js";
import { AxiosError } from "axios";
import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";

export const reportError = async (
  error: Error | AxiosError,
  metadata: {
    context: string;
  } & Record<string, string>,
  bot: ArchitectsBot,
) => {
  const channel = bot.channels.cache.get(SYSTEM_ERRORS_CHANNEL_ID);

  if (!channel || !(channel instanceof TextChannel)) {
    console.error("Channel not found or it is not a text channel.");
    return;
  }

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
};
