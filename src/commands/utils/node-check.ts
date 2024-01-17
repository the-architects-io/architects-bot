import { SlashCommandBuilder } from '@discordjs/builders';
import { getNodeStatuses } from '../../features/get-node-statuses';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('node-check')
		.setDescription('Provides up status for nodes.'),
	async execute(interaction) {
    const statuses = await getNodeStatuses()

		await interaction.reply(`\`\`\`${JSON.stringify(statuses, null, 2)}\`\`\``);
	},
};