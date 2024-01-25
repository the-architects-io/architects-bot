import { Client, Collection } from "discord.js";

export interface ArchitectsBot extends Client {
  commands: Collection<string, any>;
}

export enum UploadJobStatus {
  IN_PROGRESS = "IN_PROGRESS",
  ERROR = "ERROR",
  COMPLETE = "COMPLETE",
}

export const StatusUUIDs = {
  [UploadJobStatus.IN_PROGRESS]: "534090fe-488a-42fc-9573-84a65ff9fc57",
  [UploadJobStatus.ERROR]: "03b962a7-2a48-4efc-9d42-9d827728ab71",
  [UploadJobStatus.COMPLETE]: "39353545-336d-4fce-a039-cc4fc203a8a9",
};
