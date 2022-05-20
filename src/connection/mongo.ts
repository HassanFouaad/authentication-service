import mongoose from "mongoose";

import { logger } from "../core";

export const mongoDBConnection = async (mongoConnectionString: string) => {
  try {
    await mongoose.connect(mongoConnectionString);

    mongoose.connection.on("disconnected", () => {
      logger.error("Mongoose connection is disconnected.");
    });

    logger.info("Mongo DB is initialized and connected");
  } catch (error) {
    logger.error("Mongo DB CONNECTION ERROR", error);
  }
};
