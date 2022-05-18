import { createClient } from "redis";

import { redisHost } from "../config";
import { logger } from "../core";

logger;

let redisClient = createClient({ url: `redis://${redisHost}` });
(async () => {
  redisClient.on("error", (err: any) => {
    logger.error("Redis Error", err);
    throw new Error(err.message);
  });

  redisClient.connect();

  redisClient.on("connect", () => {
    logger.info("Redis has been Connected");
  });

  redisClient.on("ready", () => {
    logger.info("Redis connection is ready");
  });

  redisClient.on("end", () => {
    logger.error("Redis has been disconnected");
  });

  process.on("SIGINT", () => {
    redisClient.quit();
  });
})();

export default redisClient;
