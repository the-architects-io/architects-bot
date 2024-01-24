import { ArchitectsBot } from "../../types";
import { SYSTEM_WALLETS_CHANNEL_ID } from "../../constants";
import { TextChannel } from "discord.js";
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

  const { address, message } = walletUpdate;

  const balanceInLamports = message?.params?.result?.value?.lamports;
  const fields = [{ name: "Address", value: address }];

  if (balanceInLamports) {
    const balanceInSol = balanceInLamports / 1000000000;
    fields.push({ name: "SOL Balance", value: balanceInSol.toString() });
  }

  const embed = new EmbedBuilder()
    .setTitle("System Wallet Update")
    .addFields([...fields, { name: "\u200B", value: "\u200B" }])
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
