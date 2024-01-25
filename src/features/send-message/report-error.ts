import { ArchitectsBot } from "../../types";
import { SYSTEM_ERRORS_CHANNEL_ID } from "../../constants";
import { TextChannel } from "discord.js";
import { AxiosError } from "axios";
import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { convertNumbersToStrings } from "../../utils/json";

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

  const stringifiedError = convertNumbersToStrings(error);
  const stringifiedMetadata = convertNumbersToStrings(metadata);

  const fields = [
    { name: "Error", value: stringifiedError.message },
    { name: "Message", value: stringifiedMetadata?.message },
    { name: "Context", value: stringifiedMetadata?.context },
  ];

  console.log("in bot", {
    error: stringifiedError,
    metadata: stringifiedMetadata,
  });
  console.log("error instanceof AxiosError", error instanceof AxiosError);

  // @ts-ignore
  if (!!stringifiedError?.config?.url) {
    // @ts-ignore
    fields.push({ name: "URL", value: stringifiedError.config.url });
  }
  // @ts-ignore
  if (!!stringifiedError?.code) {
    // @ts-ignore
    fields.push({ name: "Code", value: stringifiedError.code });
  }

  const embed = new EmbedBuilder()
    .setTitle("System Error")
    .addFields([...fields])
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
