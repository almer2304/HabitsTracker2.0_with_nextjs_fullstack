import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/schema.ts", // Sesuaikan dengan path folder kamu yang baru
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:almer2304@localhost:5432/habit_tracker_db",
  },
});