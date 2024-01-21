import { Client, Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { ArchitectsBot } from "../types";

export const setupBotCommands = (client: ArchitectsBot) => {
  client.commands = new Collection();
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(`Command ${command.data.name} loaded`);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
};
