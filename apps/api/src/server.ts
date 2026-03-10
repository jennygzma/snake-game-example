import cors from "cors";
import express from "express";
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { gameRouter } from "./routes/gameRoutes";
import { createThemeRouter } from "./routes/themeRoutes";
import { createProfileRouter } from "./routes/profileRoutes";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = Number(process.env.PORT ?? 4000);

// Initialize SQLite database
const db = new Database(":memory:");
db.pragma("journal_mode = WAL");

// Run schema migrations
const schemaSQL = readFileSync(join(__dirname, "db", "schema.sql"), "utf-8");
db.exec(schemaSQL);

app.use(cors());
app.use(express.json());
app.use("/v1", gameRouter);
app.use("/v1/themes", createThemeRouter(db));
app.use("/v1/profiles", createProfileRouter(db));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`api running on http://localhost:${port}`);
});
