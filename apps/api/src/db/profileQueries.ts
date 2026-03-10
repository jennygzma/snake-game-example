import type { Database } from "better-sqlite3";
import type { Profile, CreateProfileInput, UpdateProfileInput } from "@snake/contracts";

export const profileQueries = (db: Database) => ({
  /**
   * List all profiles
   */
  list(): Profile[] {
    const rows = db
      .prepare(
        `SELECT id, name, avatar_base64, created_at, updated_at, is_active
         FROM profiles
         ORDER BY created_at DESC`
      )
      .all() as Array<{
      id: string;
      name: string;
      avatar_base64: string | null;
      created_at: string;
      updated_at: string;
      is_active: number;
    }>;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      avatarBase64: row.avatar_base64,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    }));
  },

  /**
   * Get a specific profile by ID
   */
  getById(id: string): Profile | null {
    const row = db
      .prepare(
        `SELECT id, name, avatar_base64, created_at, updated_at, is_active
         FROM profiles
         WHERE id = ?`
      )
      .get(id) as
      | {
          id: string;
          name: string;
          avatar_base64: string | null;
          created_at: string;
          updated_at: string;
          is_active: number;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      avatarBase64: row.avatar_base64,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    };
  },

  /**
   * Get the active profile
   */
  getActive(): Profile | null {
    const row = db
      .prepare(
        `SELECT id, name, avatar_base64, created_at, updated_at, is_active
         FROM profiles
         WHERE is_active = 1
         LIMIT 1`
      )
      .get() as
      | {
          id: string;
          name: string;
          avatar_base64: string | null;
          created_at: string;
          updated_at: string;
          is_active: number;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      avatarBase64: row.avatar_base64,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active === 1
    };
  },

  /**
   * Create a new profile
   */
  create(input: CreateProfileInput): Profile {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Check if this is the first profile
    const profileCount = (
      db.prepare(`SELECT COUNT(*) as count FROM profiles`).get() as { count: number }
    ).count;
    const isActive = profileCount === 0 ? 1 : 0;

    db.prepare(
      `INSERT INTO profiles (id, name, avatar_base64, created_at, updated_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, input.name, input.avatarBase64 ?? null, now, now, isActive);

    return {
      id,
      name: input.name,
      avatarBase64: input.avatarBase64 ?? null,
      createdAt: now,
      updatedAt: now,
      isActive: isActive === 1
    };
  },

  /**
   * Update an existing profile
   */
  update(id: string, input: UpdateProfileInput): Profile | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const name = input.name ?? existing.name;
    const avatarBase64 = input.avatarBase64 !== undefined ? input.avatarBase64 : existing.avatarBase64;

    db.prepare(
      `UPDATE profiles
       SET name = ?, avatar_base64 = ?, updated_at = ?
       WHERE id = ?`
    ).run(name, avatarBase64, now, id);

    return {
      ...existing,
      name,
      avatarBase64,
      updatedAt: now
    };
  },

  /**
   * Delete a profile (CASCADE will delete related themes and runs)
   */
  delete(id: string): boolean {
    const result = db.prepare(`DELETE FROM profiles WHERE id = ?`).run(id);
    return result.changes > 0;
  },

  /**
   * Activate a profile (and deactivate all others)
   */
  activate(id: string): Profile | null {
    const profile = this.getById(id);
    if (!profile) return null;

    // Deactivate all profiles
    db.prepare(`UPDATE profiles SET is_active = 0`).run();

    // Activate the specified profile
    db.prepare(`UPDATE profiles SET is_active = 1 WHERE id = ?`).run(id);

    return {
      ...profile,
      isActive: true
    };
  }
});