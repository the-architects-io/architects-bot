import { Client, Collection } from "discord.js";

export interface ArchitectsBot extends Client {
  commands: Collection<string, any>;
}
