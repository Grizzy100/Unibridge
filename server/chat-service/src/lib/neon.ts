import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// SSL is already specified in the connection string (?sslmode=require)
// Do NOT also pass ssl: "require" here as it causes conflicts with the postgres driver
export const sql = postgres(databaseUrl, {
  max: Number(process.env.DB_POOL_MAX ?? 10),
});
