import path from 'path';
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./app/drizzle/schema.server.ts",
  out: "./app/drizzle/migrations",
  dbCredentials: {
    url: process.env.DB_URL as string,
  }
});