import { WebSocket } from "ws";
import { messageTypes } from "../types/messages";
import axios from "axios";
import {
  BASE_URL,
  EXECUTION_WALLET_ADDRESS,
  HELIUS_API_KEY,
} from "../constants";
import { reportWalletUpdate } from "../features/send-message/report-wallet-update";
import { ArchitectsBot } from "../types";

const { PING, PONG, UPDATE_SYSTEM_WALLET } = messageTypes;

export const setupEventListeners = (ws: WebSocket) => {
  ws.on("message", async function (message: string) {
    const { type, payload } = JSON.parse(message);

    console.log({
      type,
      payload,
    });

    switch (type) {
      case PING: {
        console.log("Received PING");
        ws.send(
          JSON.stringify({
            type: PONG,
            payload: {
              timestamp: Date.now(),
            },
          }),
        );
        break;
      }
      case UPDATE_SYSTEM_WALLET: {
        break;
      }
      default: {
        console.log("No handler for this type of message");
      }
    }
  });
};

export const setupMemoryWatcher = (ws: WebSocket) => {
  const id = setInterval(
    function () {
      ws.send(JSON.stringify(process.memoryUsage()));
    },
    1000 * 60 * 5, // 5 minutes
  );
  console.log("started client interval");

  return id;
};

export const setupWalletsWatcher = (ws: WebSocket, bot: ArchitectsBot) => {
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
        EXECUTION_WALLET_ADDRESS, // pubkey of account we want to subscribe to
        {
          encoding: "jsonParsed", // base58, base64, base65+zstd, jsonParsed
          commitment: "confirmed", // defaults to finalized if unset
        },
      ],
    };
    heliusWs.send(JSON.stringify(request));
  }

  // Define WebSocket event handlers

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
