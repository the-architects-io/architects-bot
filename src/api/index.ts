import { FastifyInstance } from "fastify";
import { ArchitectsBot } from "../types";
import { reportError } from "./report-error";
import { updateJob } from "./update-job";

export const setupApiEndpoints = (
  fastify: FastifyInstance,
  bot: ArchitectsBot,
) => {
  fastify.get("/bot/hello", async (request, reply) => {
    return { greeting: "HELLO I AM ARCBOT" };
  });

  fastify.post("/bot/report-error", async (request, reply) => {
    reportError(request, reply, bot);
  });

  fastify.post("/bot/report-job", async (request, reply) => {
    updateJob(request, reply, bot);
  });
};
