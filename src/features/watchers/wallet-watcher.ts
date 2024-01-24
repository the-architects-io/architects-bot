import WebSocket from "ws";
import { EXECUTION_WALLET_ADDRESS, HELIUS_API_KEY } from "../../constants";
import { ArchitectsBot } from "../../types";
import { reportWalletUpdate } from "../send-message/report-wallet-update";

export const setupWalletsWatcher = (bot: ArchitectsBot) => {
  // Create a WebSocket connection
  const heliusWs = new WebSocket(
    `wss://atlas-mainnet.helius-rpc.com?api-key=${HELIUS_API_KEY}`,
  );

  // Function to send a request to the WebSocket server
  function sendRequest() {
    const request = {
      jsonrpc: "2.0",
      id: 420,
      method: "accountSubscribe",
      params: [
        EXECUTION_WALLET_ADDRESS,
        {
          encoding: "jsonParsed", // base58, base64, base65+zstd, jsonParsed
          commitment: "confirmed", // defaults to finalized if unset
        },
      ],
    };
    heliusWs.send(JSON.stringify(request));
  }

  heliusWs.on("open", function open() {
    console.log("Helius webSocket is open");
    sendRequest();
  });

  heliusWs.on("message", function incoming(data) {
    const messageStr = data.toString("utf8");
    try {
      const messageObj = JSON.parse(messageStr);
      console.log({ messageObj });
      reportWalletUpdate(messageObj, bot);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
    }
  });

  heliusWs.on("error", function error(err) {
    console.error("WebSocket error:", err);
  });

  heliusWs.on("close", function close() {
    console.log("WebSocket is closed");
  });
};
