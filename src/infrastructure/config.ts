import { Config, Schema } from "effect";

export const ConfigLive = Config.all({
  env: Config.literal("TEST", "DEV", "STAGING", "PROD")("ENV"),
  port: Config.integer("PORT").pipe(Config.withDefault(3000)),
  dbPath: Config.string("DB_PATH"),
  jwtSecret: Config.string("JWT_SECRET"),
});
