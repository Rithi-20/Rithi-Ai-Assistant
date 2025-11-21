import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

export const pgDb = drizzle(client);
