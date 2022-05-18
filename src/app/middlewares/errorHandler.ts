import { logger, ServerError } from "../../core";
import { Request, Response, NextFunction } from "express";

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  throw reason;
});

process.on("uncaughtException", (err) => {
  const error = {
    message: err.message,
    stack: err.stack,
  };
  logger.error(error);
  if (process.env?.NODE_ENV === "production") process.exit(1);
  else console.error(err);
});

interface IGError {
  status: number;
  message: string;
  name: string;
  stack: any;
  expiredAt: any;
}

export default (
  err: IGError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!err) next();

    if (!err.status) {
      logger.error(`No-Status Error in ${req.path}, server error: ${err}`);
      return res.status(500).json({
        error: err,
        status: 500,
      });
    }

    if (err.name === "TypeError" || err.name === "ReferenceError") {
      logger.error(`Requested URL ${req.originalUrl}, method: ${req.method}`);
      logger.error(`exception Error ${err}`);
      logger.error(`exception Error stack ${err.stack}`);
    }

    const ErrorObj = new ServerError(err.message, err.status);
    if (!ErrorObj.status) ErrorObj.status = 500;

    const error = {
      message: ErrorObj.message,
      requestedUrl: req.url,
      requestedMethod: req.method,
      status: ErrorObj.status,
      stack: ErrorObj.stack,
    };

    logger.error(
      `${error.message} -- ${error.requestedUrl} -- ${error.requestedMethod}`
    );

    return res.status(err.status).json({
      error: {
        message: error?.message,
        status: error.status,
      },
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
