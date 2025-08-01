import { Client, TextChannel, EmbedBuilder, Message } from "discord.js";
import { getNodeStatuses } from "../features/get-node-statuses";
import dayjs from "dayjs";
import {
  DAGGER_ALERT_CHANNEL_ID,
  DAGGER_MONOTOR_CHANNEL_ID,
} from "../constants";

export const initDaggerMonitor = async (client: Client) => {
  const channel = client.channels.cache.get(DAGGER_MONOTOR_CHANNEL_ID);
  const alertChannel = client.channels.cache.get(DAGGER_ALERT_CHANNEL_ID);

  if (!channel || !alertChannel) return;
  if (
    !channel ||
    !(channel instanceof TextChannel) ||
    !alertChannel ||
    !(alertChannel instanceof TextChannel)
  ) {
    console.error("Channel not found or it is not a text channel.");
    return;
  }

  let statusMessage: Message | null = null;
  let alertMessage: Message | null = null;

  setInterval(async () => {
    try {
      const statuses = await getNodeStatuses();
      const embed = new EmbedBuilder()
        .setTitle("Server Status")
        .setDescription(
          statuses
            .map(({ ip, isActive }) => `${ip} is ${isActive ? "up" : "down"}`)
            .join("\n"),
        )
        .setFooter({
          text: "Last checked " + dayjs().format("MM-DD-YY @ HH:mm:ss"),
        })
        .setColor(statuses.some(({ isActive }) => !isActive) ? "Red" : "Green");

      if (statusMessage) {
        console.log(`Sending message to channel ID: ${channel.id}`);
        await statusMessage.edit({ embeds: [embed] });
      } else {
        statusMessage = await channel.send({ embeds: [embed] });
      }

      const downNodes = statuses.filter(({ isActive }) => !isActive);

      if (downNodes.length > 0) {
        const alertEmbed = new EmbedBuilder()
          .setTitle("Alert: Node Down")
          .setDescription(
            `The following nodes are down:\n${downNodes.map(({ ip }) => ip).join("\n")}`,
          )
          .setColor("Red");

        if (alertMessage) {
          console.log(`Sending message to channel ID: ${channel.id}`);
          await alertMessage.edit({ embeds: [alertEmbed] });
        } else {
          alertMessage = await alertChannel.send({ embeds: [alertEmbed] });
        }
      } else {
        // Consider handling the case when all nodes are back up.
      }
    } catch (error) {
      console.error("Error in setInterval: ", error);
    }
  }, 30000);
};
