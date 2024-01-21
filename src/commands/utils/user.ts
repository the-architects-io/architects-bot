import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction: CommandInteraction) {
    // Ensure interaction.member is a GuildMember before accessing GuildMember properties
    if (interaction.member instanceof GuildMember) {
      await interaction.reply(
        `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
      );
    } else {
      await interaction.reply(
        `This command was run by ${interaction.user.username}.`,
      );
    }
  },
};
