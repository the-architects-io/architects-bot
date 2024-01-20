import { Client, TextChannel, EmbedBuilder } from "discord.js";
import { getNodeStatuses } from "../features/get-node-statuses";
import dayjs from "dayjs";

export const initDaggerMonitor = async (client: Client) => {
  const channel = client.channels.cache.get("1197319601965510677");
  const alertChannel = client.channels.cache.get("1197324145579544616");

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

  let statusMessage;
  let alertMessage;

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
