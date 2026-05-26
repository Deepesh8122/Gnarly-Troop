import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  server: process.env.DB_HOST!,
  //port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  try {
    if (!pool) {
      // console.log("Connecting with config:", config);
      pool = await new sql.ConnectionPool(config).connect();
      // console.log("Connected to SQL SERVER");
    }
    return pool;
  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED:", err);
    throw err;
  }
}
