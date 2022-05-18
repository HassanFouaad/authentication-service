import { createServer } from "http";
import { app } from "./app";
import { port, mongoConnectionString } from "./config";
import { mongoDBConnection } from "./connection/mongo";
import { logger } from "./core";

const httpServer = createServer(app);

const start = async () => {
  mongoDBConnection(mongoConnectionString);

  httpServer.listen(port, () => {
    logger.info(`Nodejs Application is up and running on port ${port}`);
  });
};

start();
