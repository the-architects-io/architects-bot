import { FastifyReply, FastifyRequest } from "fastify";
import { ArchitectsBot } from "../../types";
import { JOBS_CHANNEL_ID } from "../../constants";
import { Message, TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";

// from nhost
export interface User {
  /** User's unique identifier (uuid) */
  id: string;
  /** The date-time when the user has been created */
  createdAt: string;
  /** User's display name */
  displayName: string;
  /** The URL to the user's profile picture */
  avatarUrl: string;
  /** The locale of the user, as a two-characters string
   * @example `'en'`
   */
  locale: string;
  /** User's email address */
  email?: string;
  /** Whether or not the user is anonymous */
  isAnonymous: boolean;
  /** The default role of the user
   * @example `'user'`
   */
  defaultRole: string;
  /** The roles assigned to the user
   * @example `['user', 'me']`
   */
  roles: string[];
  /** Additional attributes used for user information */
  metadata: Record<string, unknown>;
  /** Is `true` if the user email has not been verified */
  emailVerified: boolean;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  activeMfaType: "totp" | null;
}

const JobIcons = {
  CREATING_SHADOW_DRIVE: "CREATING_SHADOW_DRIVE",
  EXTRACTING_FILES: "EXTRACTING_FILES",
  UPLOADING_FILES: "UPLOADING_FILES",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  MINTING_NFTS: "MINTING_NFTS",
  COLLECTION_IMAGE: "COLLECTION_IMAGE",
  CREATING_TREE: "CREATING_TREE",
} as const;

type JobIconType = (typeof JobIcons)[keyof typeof JobIcons];

export type Job = {
  id: string;
  status: {
    id: string;
    name: string;
  };
  icon?: JobIconType;
  statusText?: string;
  user: User;
  percentComplete?: number;
  jobType: {
    id: string;
    name: string;
  };
  cluster?: string;
};

const buildEmbed = (job: Job) => {
  console.log({ job });
  const fields = [
    { name: "ID", value: job.id },
    { name: "Message", value: job?.statusText ? job.statusText : "" },
    // { name: "User", value: job.user.displayName },
    // { name: "Status", value: job.status.name },
    {
      name: "Current Step Progress",
      value: job?.percentComplete ? `${job.percentComplete}%` : "N/A",
    },
    { name: "Cluster", value: job?.cluster ? job.cluster : "N/A" },
  ];

  const jobType = job?.jobType?.name ? job.jobType.name : "Job";

  const embed = new EmbedBuilder()
    .setTitle(jobType)
    .addFields([...fields, { name: "\u200B", value: "\u200B" }])
    .setDescription(
      `
Last action:
\`\`\`
${JSON.stringify(job, null, 2)}
\`\`\`
        `,
    )
    .setFooter({
      text: "Last updated " + dayjs().format("MM-DD-YY @ HH:mm:ss"),
    })
    .setColor(0x335733);

  return embed;
};

export const reportJob = async (
  job: Job,
  metadata: {
    context: string;
  } & Record<string, string>,
  bot: ArchitectsBot,
) => {
  const channel = bot.channels.cache.get(JOBS_CHANNEL_ID);

  if (!channel || !(channel instanceof TextChannel)) {
    console.error("Channel not found or it is not a text channel.");
    return;
  }

  const messages = await channel.messages.fetch({ limit: 100 });

  const existingMessage = messages.find((message) =>
    message.embeds.some((embed) =>
      embed.fields.some(
        (field) => field.name === "ID" && field.value === job.id,
      ),
    ),
  );

  const embed = buildEmbed(job);

  if (existingMessage) {
    await existingMessage.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }
};
