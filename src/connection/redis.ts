import { createClient, RedisClientType } from "redis";

import { redisHost } from "../config";
import { logger } from "../core";

class RedisConnection {
  private redisClient: RedisClientType;
  constructor() {
    this.redisClient = createClient({ url: `redis://${redisHost}` });
  }

  connect() {
    this.redisClient.connect();
    this.logs();
  }
  get client() {
    return this.redisClient;
  }

  logs() {
    this.redisClient.on("connect", () => {
      logger.info("Redis has been Connected");
    });

    this.redisClient.on("error", (err: any) => {
      logger.error("Redis Error", err);
      throw new Error(err.message);
    });

    this.redisClient.on("ready", () => {
      logger.info("Redis connection is ready");
    });

    this.redisClient.on("end", () => {
      logger.error("Redis has been disconnected");
    });
  }
}

let redisConnection = new RedisConnection();

redisConnection.connect();

let redisClient = redisConnection.client;

export default redisClient;
