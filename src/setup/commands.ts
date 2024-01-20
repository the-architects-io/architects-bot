import { Client, Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";

export const setupBotCommands = (client: Client) => {
  // @ts-ignore
  client.commands = new Collection();
  const foldersPath = path.join(__dirname, "..", "commands");

  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        // @ts-ignore
        client.commands.set(command.data.name, command);
        // @ts-ignore
        console.log(client.commands);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
};
