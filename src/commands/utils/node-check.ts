import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getNodeStatuses } from "../../features/get-node-statuses";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("node-check")
    .setDescription("Provides up status for nodes."),
  async execute(interaction: CommandInteraction) {
    const statuses = await getNodeStatuses();

    await interaction.reply(`\`\`\`${JSON.stringify(statuses, null, 2)}\`\`\``);
  },
};
