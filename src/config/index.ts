import "dotenv/config";

export const port = parseInt(String(process.env.PORT));

export const mongoConnectionString = String(
  process.env.MONGO_CONNECTION_STRING
);

export const redisPort = String(process.env.REDIS_PORT);
export const redisHost = String(process.env.REDIS_HOST);

export const accessTokenSecret = String(process.env.ACCESS_TOKEN_SECRET);
export const accessTokenExpiresIn = String(process.env.ACCESS_TOKEN_EXPIRES_IN);
