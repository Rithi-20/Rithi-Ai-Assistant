// import { defineConfig } from "drizzle-kit";
// import dotenv from "dotenv";

// dotenv.config({ path: ".env" }); // make drizzle load .env

// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./src/db/schema",
//   out: "./drizzle",
//   dbCredentials: {
//     url: process.env.POSTGRES_URL!,
//   },
// });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/pg/schema.pg.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
