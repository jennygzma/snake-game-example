import type { Database } from "better-sqlite3";
import type { Profile, CreateProfileInput, UpdateProfileInput } from "@snake/contracts";

export const profileQueries = (db: Database) => ({
  listProfiles(): Profile[] {
    const stmt = db.prepare(`
      SELECT id, name, avatar_base64 as avatarBase64, created_at as createdAt, 
             updated_at as updatedAt, is_active as isActive
      FROM profiles
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all() as Array<{
      id: string;
      name: string;
      avatarBase64: string | null;
      createdAt: string;
      updatedAt: string;
      isActive: number;
    }>;
    
    return rows.map(row => ({
      ...row,
      avatarBase64: row.avatarBase64 || null,
      isActive: row.isActive === 1
    }));
  },

  getProfile(id: string): Profile | null {
    const stmt = db.prepare(`
      SELECT id, name, avatar_base64 as avatarBase64, created_at as createdAt, 
             updated_at as updatedAt, is_active as isActive
      FROM profiles
      WHERE id = ?
    `);
    
    const row = stmt.get(id) as {
      id: string;
      name: string;
      avatarBase64: string | null;
      createdAt: string;
      updatedAt: string;
      isActive: number;
    } | undefined;
    
    if (!row) return null;
    
    return {
      ...row,
      avatarBase64: row.avatarBase64 || null,
      isActive: row.isActive === 1
    };
  },

  getActiveProfile(): Profile | null {
    const stmt = db.prepare(`
      SELECT id, name, avatar_base64 as avatarBase64, created_at as createdAt, 
             updated_at as updatedAt, is_active as isActive
      FROM profiles
      WHERE is_active = 1
      LIMIT 1
    `);
    
    const row = stmt.get() as {
      id: string;
      name: string;
      avatarBase64: string | null;
      createdAt: string;
      updatedAt: string;
      isActive: number;
    } | undefined;
    
    if (!row) return null;
    
    return {
      ...row,
      avatarBase64: row.avatarBase64 || null,
      isActive: row.isActive === 1
    };
  },

  createProfile(input: CreateProfileInput): Profile {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Check if this is the first profile
    const countStmt = db.prepare("SELECT COUNT(*) as count FROM profiles");
    const { count } = countStmt.get() as { count: number };
    const isActive = count === 0 ? 1 : 0; // Auto-activate if first profile
    
    const stmt = db.prepare(`
      INSERT INTO profiles (id, name, avatar_base64, created_at, updated_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, input.name, input.avatarBase64 || null, now, now, isActive);
    
    return {
      id,
      name: input.name,
      avatarBase64: input.avatarBase64 || null,
      createdAt: now,
      updatedAt: now,
      isActive: isActive === 1
    };
  },

  updateProfile(id: string, input: UpdateProfileInput): Profile | null {
    const existing = this.getProfile(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    const name = input.name ?? existing.name;
    const avatarBase64 = input.avatarBase64 !== undefined ? input.avatarBase64 : existing.avatarBase64;
    
    const stmt = db.prepare(`
      UPDATE profiles
      SET name = ?, avatar_base64 = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(name, avatarBase64, now, id);
    
    return {
      ...existing,
      name,
      avatarBase64,
      updatedAt: now
    };
  },

  deleteProfile(id: string): boolean {
    const stmt = db.prepare("DELETE FROM profiles WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },

  activateProfile(id: string): Profile | null {
    const profile = this.getProfile(id);
    if (!profile) return null;
    
    // Deactivate all profiles
    const deactivateStmt = db.prepare("UPDATE profiles SET is_active = 0");
    deactivateStmt.run();
    
    // Activate the specified profile
    const activateStmt = db.prepare("UPDATE profiles SET is_active = 1, updated_at = ? WHERE id = ?");
    const now = new Date().toISOString();
    activateStmt.run(now, id);
    
    return {
      ...profile,
      isActive: true,
      updatedAt: now
    };
  }
});