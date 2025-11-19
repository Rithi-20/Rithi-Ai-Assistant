// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "@/db/schema/resume"; // your resume schema

// const connectionString = process.env.POSTGRES_URL;

// if (!connectionString) {
//   throw new Error("❌ POSTGRES_URL is missing in .env.local");
// }

// const client = postgres(connectionString, { max: 1 });

// export const db = drizzle(client, { schema });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.POSTGRES_URL!, { ssl: false });

export const db = drizzle(client);
