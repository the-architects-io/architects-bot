import dotenv from "dotenv";
dotenv.config();

export const DAGGER_MONOTOR_CHANNEL_ID = "1198411560117358602";
export const DAGGER_ALERT_CHANNEL_ID = "1197324145579544616";
export const SYSTEM_ERRORS_CHANNEL_ID = "1197404078590926918";
export const JOBS_CHANNEL_ID = "1198421433425088624";
export const SYSTEM_WALLETS_CHANNEL_ID = "1199843295417868289";
export const BASE_URL = "http://localhost:3002/bot";
export const RPC_ENDPOINT_DEVNET = "https://api.devnet.solana.com";
export const RPC_ENDPOINT = process.env.RPC_ENDPOINT;
export const BOT_API_URL = "http://localhost:3002/bot";
export const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
export const EXECUTION_WALLET_ADDRESS = process.env.EXECUTION_WALLET_ADDRESS;
export const HEX_COLORS = {
  RED: 0xff3333,
  GREEN: 0x33ff33,
};
