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
