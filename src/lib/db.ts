import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema/schema"; // Sesuaikan path-nya

const pool = new Pool({
  connectionString: "postgresql://postgres:almer2304@localhost:5432/habit_tracker_db",
});

export const db = drizzle(pool, { schema });