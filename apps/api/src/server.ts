import cors from "cors";
import express from "express";
import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createGameRouter } from "./routes/gameRoutes";
import { createThemeRouter } from "./routes/themeRoutes";
import { createProfileRouter } from "./routes/profileRoutes";
import { createVariationRoutes } from "./routes/variationRoutes";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = Number(process.env.PORT ?? 4000);

// Initialize persistent SQLite database
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });
const db = new Database(join(dataDir, "snake.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const hasColumn = (tableName: string, columnName: string): boolean => {
  const columns = db.pragma(`table_info(${tableName})`) as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
};

const ensureColumn = (tableName: string, columnName: string, definition: string): void => {
  const columns = db.pragma(`table_info(${tableName})`) as Array<{ name: string }>;
  if (columns.length === 0 || hasColumn(tableName, columnName)) {
    return;
  }
  db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition};`);
};

// Backward compatibility for legacy databases created before newer schema columns existed.
ensureColumn("profiles", "is_active", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("custom_themes", "user_id", "TEXT");
ensureColumn("custom_themes", "profile_id", "TEXT");
ensureColumn("custom_themes", "is_active", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("game_variations", "is_active", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("game_runs", "variation_id", "TEXT");
db.exec(`
  UPDATE custom_themes
  SET user_id = profile_id
  WHERE user_id IS NULL AND profile_id IS NOT NULL;
`);

// Run schema migrations
const schemaSQL = readFileSync(join(__dirname, "db", "schema.sql"), "utf-8");
db.exec(schemaSQL);

app.use(cors());
app.use(express.json());
app.use("/v1", createGameRouter(db));
app.use("/v1/themes", createThemeRouter(db));
app.use("/v1/profiles", createProfileRouter(db));
app.use("/v1/variations", createVariationRoutes(db));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`api running on http://localhost:${port}`);
});
