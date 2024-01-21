import { REST, Routes } from "discord.js";
import { clientId, guildId, token } from "../config.json";
import * as fs from "node:fs";
import * as path from "node:path";

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath).filter((folder) => {
  const folderPath = path.join(foldersPath, folder);
  return fs.statSync(folderPath).isDirectory();
});

console.log({
  foldersPath,
  commandFolders,
});

for (const folder of commandFolders) {
  // Grab all the command files from each command directory
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  console.log({
    commandsPath,
    commandFiles,
  });

  // Process each command file
  for (const file of commandFiles) {
    console.log({
      file,
    });
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
