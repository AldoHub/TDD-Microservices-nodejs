import PinoHttp from "pino-http";
import pino from "pino";

export const logger = pino({
  level: "info",
  base: {
    serviceName: "order-service",
  },
  serializers: pino.stdSerializers,
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  transport: {
    target: "pino-pretty", // for production we can use sentry
    level: "error",
  },
});

export const httpLogger = PinoHttp({
  level: "error",
  logger,
});