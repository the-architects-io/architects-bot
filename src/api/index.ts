import { FastifyInstance } from "fastify";
import { ArchitectsBot } from "../types";
import { reportError } from "../features/send-message/report-error";
import { Job, reportJob } from "../features/send-message/report-job";
import { AxiosError } from "axios";

export const setupApiEndpoints = (
  fastify: FastifyInstance,
  bot: ArchitectsBot,
) => {
  fastify.get("/bot/hello", async (request, reply) => {
    return { greeting: "HELLO I AM ARCBOT" };
  });

  fastify.post("/bot/report-error", async (request, reply) => {
    const { error, metadata } = request.body as unknown as {
      error:
        | Error
        | (AxiosError extends { response: { data: { error: infer E } } }
            ? E
            : never);
      metadata: {
        context: string;
      } & Record<string, string>;
    };

    reportError(error, metadata, bot);
  });

  fastify.post("/bot/report-job", async (request, reply) => {
    const { job, metadata } = request.body as unknown as {
      job: Job;
      metadata: {
        context: string;
      } & Record<string, string>;
    };

    reportJob(job, metadata, bot);
  });
};
