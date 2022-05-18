import mongoose from "mongoose";

import { logger } from "../core";

export const mongoDBConnection = (mongoConnectionString: string) => {
  mongoose.connect(mongoConnectionString).catch((e) => {
    logger.error("[*] Mongoose connection Error ", e);
    process.exit(1);
  });

  mongoose.connection.on("connected", () => {
    logger.info("Mongo DB is initialized and connected");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    logger.error("Mongoose connection is disconnected.");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};
