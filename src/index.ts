import * as fs from 'node:fs';
import * as path from 'node:path';
import { Client, Collection, Events, GatewayIntentBits, TextChannel } from 'discord.js';
import { token } from '../config.json';
import { getNodeStatuses } from './features/get-node-statuses';
import dayjs from 'dayjs';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// @ts-ignore
client.commands = new Collection();

// @ts-ignore
const foldersPath = path.join(__dirname, 'commands');
// @ts-ignore
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			// @ts-ignore
			client.commands.set(command.data.name, command);
			// @ts-ignore
			console.log(client.commands)
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// every 1 min send a message to the channel

client.on(Events.ClientReady, readyClient => {
	const channel = readyClient.channels.cache.get('1197319601965510677');
	const alertChannel = readyClient.channels.cache.get('1197324145579544616');
	if (!channel || !alertChannel) return;
	if (!channel || !(channel instanceof TextChannel)  || !alertChannel || !(alertChannel instanceof TextChannel)) {
		console.error('Channel not found or it is not a text channel.');
		return;
	}
	
	setInterval(async () => {
		const statuses = await getNodeStatuses()
		const formattedResponse = statuses.map(({ip, isActive}) => `${ip} is ${isActive ? 'up' : 'down'}`).join('\n')
		
		channel.send(formattedResponse);
		channel.send('Last checked ' + dayjs().format('MM-DD-YY @ HH:mm:ss'));

		const downNodes = statuses.filter(({isActive}) => !isActive)

		if (downNodes.length > 0) {
			alertChannel.send(`The following nodes are down:\n${downNodes.map(({ip}) => ip).join('\n')}`)
		}
	}, 30000);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	// @ts-ignore
	const command = client.commands.get(interaction.commandName);

	// @ts-ignore
	

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);