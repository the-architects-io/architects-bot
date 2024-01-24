import { ArchitectsBot } from "../../types";
import {
  SYSTEM_ERRORS_CHANNEL_ID,
  SYSTEM_WALLETS_CHANNEL_ID,
} from "../../constants";
import { TextChannel } from "discord.js";
import { AxiosError } from "axios";
import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";

export const reportWalletUpdate = async (
  walletUpdate: any,
  bot: ArchitectsBot,
) => {
  const channel = bot.channels.cache.get(SYSTEM_WALLETS_CHANNEL_ID);

  if (!channel || !(channel instanceof TextChannel)) {
    console.error("Channel not found or it is not a text channel.");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("System Wallet Update")
    .setDescription(
      `
\`\`\`
${JSON.stringify(walletUpdate, null, 2)}
\`\`\`
        `,
    )
    .setFooter({
      text: "Last updated " + dayjs().format("MM-DD-YY @ HH:mm:ss"),
    })
    .setColor(0x335733);

  await channel.send({ embeds: [embed] });
};
