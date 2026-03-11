import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "..", "data", "game.db");
const db = new Database(dbPath);

console.log("Running migration 002_add_variations...");
console.log("Database:", dbPath);

try {
  // Import and run migration
  const { runMigration, createClassicVariations } = await import("../src/db/migrations/002_add_variations.js");
  
  runMigration(db);
  createClassicVariations(db);
  
  console.log("✅ Migration completed successfully!");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}