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

  const RED = 0xff3333;
  const GREEN = 0x33ff33;
  let color = GREEN;

  let lastBalanceInSol;
  let balanceChangeInSol;
  if (balanceInLamports) {
    const balanceInSol = balanceInLamports / 1000000000;
    if (lastBalanceInSol) {
      balanceChangeInSol = balanceInSol - lastBalanceInSol;
      color = balanceChangeInSol > 0 ? GREEN : RED;
      fields.push({
        name: "Balance Change",
        value: balanceChangeInSol.toString(),
      });
    }
    lastBalanceInSol = balanceInSol;
    const minimumBalanceInSol = 1;
    const solBalanceString =
      balanceInSol > minimumBalanceInSol
        ? `${balanceInSol.toString()} SOL`
        : `⚠️⚠️ ${balanceInSol.toString()} SOL ⚠️⚠️`;
    fields.push({ name: "Balance", value: solBalanceString });
  }

  const messages = await channel.messages.fetch({ limit: 100 });

  const existingMessage = messages.find((message) =>
    message.embeds.some((embed) =>
      embed.fields.some(
        (field) => field.name === "Address" && field.value === address,
      ),
    ),
  );

  const embed = new EmbedBuilder()
    .setTitle("System Wallet Update")
    .addFields([...fields])
    .setDescription(
      `
Last action:
\`\`\`
${JSON.stringify(walletUpdate, null, 2)}
\`\`\`
        `,
    )
    .setFooter({
      text: "Last updated " + dayjs().format("MM-DD-YY @ HH:mm:ss"),
    })
    .setColor(color);

  if (existingMessage) {
    await existingMessage.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }
};
