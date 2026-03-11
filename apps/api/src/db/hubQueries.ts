import type { Database } from "better-sqlite3";
import type {
  SharedTheme,
  SharedVariation,
  SharedThemeWithCreator,
  SharedVariationWithCreator,
  CreatorProfile,
  HubSearchParams,
  ThemeColors,
  ThemeIconColors,
  PowerupType
} from "@snake/contracts";

export const hubQueries = (db: Database) => ({
  // ==================== BROWSE OPERATIONS ====================

  /**
   * Browse shared themes with search, filtering, and pagination
   */
  browseSharedThemes(params: HubSearchParams): {
    themes: SharedThemeWithCreator[];
    total: number;
  } {
    const { query, sortBy = "newest", page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    let orderClause = "st.created_at DESC";
    if (sortBy === "popular") {
      orderClause = "st.favorite_count DESC, st.created_at DESC";
    } else if (sortBy === "mostUsed") {
      orderClause = "st.usage_count DESC, st.created_at DESC";
    }

    let whereClause = "1=1";
    const whereParams: any[] = [];

    if (query) {
      whereClause += " AND (st.name LIKE ? OR st.description LIKE ?)";
      const searchPattern = `%${query}%`;
      whereParams.push(searchPattern, searchPattern);
    }

    // Get total count
    const countStmt = db.prepare(
      `SELECT COUNT(*) as total FROM shared_themes st WHERE ${whereClause}`
    );
    const countResult = countStmt.get(...whereParams) as { total: number };
    const total = countResult.total;

    // Get paginated results
    const stmt = db.prepare(
      `SELECT 
        st.id, st.creator_profile_id, st.name, st.description,
        st.font_family, st.colors, st.icon_colors,
        st.favorite_count, st.usage_count, st.created_at, st.updated_at,
        p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
       FROM shared_themes st
       JOIN profiles p ON st.creator_profile_id = p.id
       WHERE ${whereClause}
       ORDER BY ${orderClause}
       LIMIT ? OFFSET ?`
    );

    const rows = stmt.all(...whereParams, limit, offset) as Array<{
      id: string;
      creator_profile_id: string;
      name: string;
      description: string | null;
      font_family: string;
      colors: string;
      icon_colors: string;
      favorite_count: number;
      usage_count: number;
      created_at: string;
      updated_at: string;
      creator_id: string;
      creator_name: string;
      creator_avatar: string | null;
    }>;

    const themes = rows.map((row) => ({
      id: row.id,
      creatorProfileId: row.creator_profile_id,
      name: row.name,
      description: row.description || undefined,
      fontFamily: row.font_family,
      colors: JSON.parse(row.colors) as ThemeColors,
      iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
      favoriteCount: row.favorite_count,
      usageCount: row.usage_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      creator: {
        id: row.creator_id,
        name: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      }
    }));

    return { themes, total };
  },

  /**
   * Browse shared variations with search, filtering, and pagination
   */
  browseSharedVariations(params: HubSearchParams): {
    variations: SharedVariationWithCreator[];
    total: number;
  } {
    const { query, difficulty, sortBy = "newest", page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    let orderClause = "sv.created_at DESC";
    if (sortBy === "popular") {
      orderClause = "sv.favorite_count DESC, sv.created_at DESC";
    } else if (sortBy === "mostUsed") {
      orderClause = "sv.usage_count DESC, sv.created_at DESC";
    }

    let whereClause = "1=1";
    const whereParams: any[] = [];

    if (query) {
      whereClause += " AND (sv.name LIKE ? OR sv.description LIKE ?)";
      const searchPattern = `%${query}%`;
      whereParams.push(searchPattern, searchPattern);
    }

    if (difficulty) {
      whereClause += " AND sv.difficulty = ?";
      whereParams.push(difficulty);
    }

    // Get total count
    const countStmt = db.prepare(
      `SELECT COUNT(*) as total FROM shared_variations sv WHERE ${whereClause}`
    );
    const countResult = countStmt.get(...whereParams) as { total: number };
    const total = countResult.total;

    // Get paginated results
    const stmt = db.prepare(
      `SELECT 
        sv.id, sv.creator_profile_id, sv.name, sv.description, sv.difficulty,
        sv.base_speed, sv.grid_size, sv.max_concurrent_foods, sv.snake_head_image,
        sv.powerup_types, sv.custom_colors,
        sv.favorite_count, sv.usage_count, sv.created_at, sv.updated_at,
        p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
       FROM shared_variations sv
       JOIN profiles p ON sv.creator_profile_id = p.id
       WHERE ${whereClause}
       ORDER BY ${orderClause}
       LIMIT ? OFFSET ?`
    );

    const rows = stmt.all(...whereParams, limit, offset) as Array<{
      id: string;
      creator_profile_id: string;
      name: string;
      description: string | null;
      difficulty: string | null;
      base_speed: number;
      grid_size: number;
      max_concurrent_foods: number;
      snake_head_image: string | null;
      powerup_types: string;
      custom_colors: string | null;
      favorite_count: number;
      usage_count: number;
      created_at: string;
      updated_at: string;
      creator_id: string;
      creator_name: string;
      creator_avatar: string | null;
    }>;

    const variations = rows.map((row) => ({
      id: row.id,
      creatorProfileId: row.creator_profile_id,
      name: row.name,
      description: row.description || undefined,
      difficulty: (row.difficulty as "easy" | "medium" | "hard") || undefined,
      baseSpeed: row.base_speed,
      gridSize: row.grid_size,
      maxConcurrentFoods: row.max_concurrent_foods,
      snakeHeadImage: row.snake_head_image || undefined,
      powerupTypes: JSON.parse(row.powerup_types) as PowerupType[],
      customColors: row.custom_colors ? JSON.parse(row.custom_colors) : undefined,
      favoriteCount: row.favorite_count,
      usageCount: row.usage_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      creator: {
        id: row.creator_id,
        name: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      }
    }));

    return { variations, total };
  },

  // ==================== GET OPERATIONS ====================

  /**
   * Get a single shared theme by ID
   */
  getSharedTheme(id: string): SharedThemeWithCreator | null {
    const row = db
      .prepare(
        `SELECT 
          st.id, st.creator_profile_id, st.name, st.description,
          st.font_family, st.colors, st.icon_colors,
          st.favorite_count, st.usage_count, st.created_at, st.updated_at,
          p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
         FROM shared_themes st
         JOIN profiles p ON st.creator_profile_id = p.id
         WHERE st.id = ?`
      )
      .get(id) as
      | {
          id: string;
          creator_profile_id: string;
          name: string;
          description: string | null;
          font_family: string;
          colors: string;
          icon_colors: string;
          favorite_count: number;
          usage_count: number;
          created_at: string;
          updated_at: string;
          creator_id: string;
          creator_name: string;
          creator_avatar: string | null;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      creatorProfileId: row.creator_profile_id,
      name: row.name,
      description: row.description || undefined,
      fontFamily: row.font_family,
      colors: JSON.parse(row.colors) as ThemeColors,
      iconColors: JSON.parse(row.icon_colors) as ThemeIconColors,
      favoriteCount: row.favorite_count,
      usageCount: row.usage_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      creator: {
        id: row.creator_id,
        name: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      }
    };
  },

  /**
   * Get a single shared variation by ID
   */
  getSharedVariation(id: string): SharedVariationWithCreator | null {
    const row = db
      .prepare(
        `SELECT 
          sv.id, sv.creator_profile_id, sv.name, sv.description, sv.difficulty,
          sv.base_speed, sv.grid_size, sv.max_concurrent_foods, sv.snake_head_image,
          sv.powerup_types, sv.custom_colors,
          sv.favorite_count, sv.usage_count, sv.created_at, sv.updated_at,
          p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
         FROM shared_variations sv
         JOIN profiles p ON sv.creator_profile_id = p.id
         WHERE sv.id = ?`
      )
      .get(id) as
      | {
          id: string;
          creator_profile_id: string;
          name: string;
          description: string | null;
          difficulty: string | null;
          base_speed: number;
          grid_size: number;
          max_concurrent_foods: number;
          snake_head_image: string | null;
          powerup_types: string;
          custom_colors: string | null;
          favorite_count: number;
          usage_count: number;
          created_at: string;
          updated_at: string;
          creator_id: string;
          creator_name: string;
          creator_avatar: string | null;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      creatorProfileId: row.creator_profile_id,
      name: row.name,
      description: row.description || undefined,
      difficulty: (row.difficulty as "easy" | "medium" | "hard") || undefined,
      baseSpeed: row.base_speed,
      gridSize: row.grid_size,
      maxConcurrentFoods: row.max_concurrent_foods,
      snakeHeadImage: row.snake_head_image || undefined,
      powerupTypes: JSON.parse(row.powerup_types) as PowerupType[],
      customColors: row.custom_colors ? JSON.parse(row.custom_colors) : undefined,
      favoriteCount: row.favorite_count,
      usageCount: row.usage_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      creator: {
        id: row.creator_id,
        name: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      }
    };
  },

  // ==================== SHARE OPERATIONS ====================

  /**
   * Share a theme (copy from custom_themes to shared_themes)
   */
  shareTheme(
    themeId: string,
    creatorProfileId: string,
    description?: string
  ): SharedTheme | null {
    // Get the theme from custom_themes
    const theme = db
      .prepare(
        `SELECT name, font_family, colors, icon_colors
         FROM custom_themes
         WHERE id = ? AND profile_id = ?`
      )
      .get(themeId, creatorProfileId) as
      | {
          name: string;
          font_family: string;
          colors: string;
          icon_colors: string;
        }
      | undefined;

    if (!theme) return null;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO shared_themes 
       (id, creator_profile_id, name, description, font_family, colors, icon_colors, 
        favorite_count, usage_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
    ).run(
      id,
      creatorProfileId,
      theme.name,
      description || null,
      theme.font_family,
      theme.colors,
      theme.icon_colors,
      now,
      now
    );

    return {
      id,
      creatorProfileId,
      name: theme.name,
      description,
      fontFamily: theme.font_family,
      colors: JSON.parse(theme.colors) as ThemeColors,
      iconColors: JSON.parse(theme.icon_colors) as ThemeIconColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Share a variation (copy from game_variations to shared_variations)
   */
  shareVariation(
    variationId: string,
    creatorProfileId: string,
    description?: string
  ): SharedVariation | null {
    // Get the variation from game_variations
    const variation = db
      .prepare(
        `SELECT name, difficulty, base_speed, grid_size, max_concurrent_foods,
                snake_head_image, powerup_types, custom_colors
         FROM game_variations
         WHERE id = ? AND profile_id = ?`
      )
      .get(variationId, creatorProfileId) as
      | {
          name: string;
          difficulty: string | null;
          base_speed: number;
          grid_size: number;
          max_concurrent_foods: number;
          snake_head_image: string | null;
          powerup_types: string;
          custom_colors: string | null;
        }
      | undefined;

    if (!variation) return null;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO shared_variations 
       (id, creator_profile_id, name, description, difficulty, base_speed, grid_size,
        max_concurrent_foods, snake_head_image, powerup_types, custom_colors,
        favorite_count, usage_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
    ).run(
      id,
      creatorProfileId,
      variation.name,
      description || null,
      variation.difficulty,
      variation.base_speed,
      variation.grid_size,
      variation.max_concurrent_foods,
      variation.snake_head_image,
      variation.powerup_types,
      variation.custom_colors,
      now,
      now
    );

    return {
      id,
      creatorProfileId,
      name: variation.name,
      description,
      difficulty: (variation.difficulty as "easy" | "medium" | "hard") || undefined,
      baseSpeed: variation.base_speed,
      gridSize: variation.grid_size,
      maxConcurrentFoods: variation.max_concurrent_foods,
      snakeHeadImage: variation.snake_head_image || undefined,
      powerupTypes: JSON.parse(variation.powerup_types) as PowerupType[],
      customColors: variation.custom_colors ? JSON.parse(variation.custom_colors) : undefined,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Update shared theme description
   */
  updateSharedTheme(id: string, creatorProfileId: string, description?: string): boolean {
    const result = db
      .prepare(
        `UPDATE shared_themes
         SET description = ?, updated_at = ?
         WHERE id = ? AND creator_profile_id = ?`
      )
      .run(description || null, new Date().toISOString(), id, creatorProfileId);

    return result.changes > 0;
  },

  /**
   * Update shared variation description
   */
  updateSharedVariation(id: string, creatorProfileId: string, description?: string): boolean {
    const result = db
      .prepare(
        `UPDATE shared_variations
         SET description = ?, updated_at = ?
         WHERE id = ? AND creator_profile_id = ?`
      )
      .run(description || null, new Date().toISOString(), id, creatorProfileId);

    return result.changes > 0;
  },

  /**
   * Unshare a theme (delete from shared_themes)
   */
  unshareTheme(id: string, creatorProfileId: string): boolean {
    const result = db
      .prepare(`DELETE FROM shared_themes WHERE id = ? AND creator_profile_id = ?`)
      .run(id, creatorProfileId);

    return result.changes > 0;
  },

  /**
   * Unshare a variation (delete from shared_variations)
   */
  unshareVariation(id: string, creatorProfileId: string): boolean {
    const result = db
      .prepare(`DELETE FROM shared_variations WHERE id = ? AND creator_profile_id = ?`)
      .run(id, creatorProfileId);

    return result.changes > 0;
  },

  // ==================== FAVORITE OPERATIONS ====================

  /**
   * Favorite a theme
   */
  favoriteTheme(profileId: string, sharedThemeId: string): boolean {
    const now = new Date().toISOString();

    try {
      db.prepare(
        `INSERT INTO theme_favorites (profile_id, shared_theme_id, created_at)
         VALUES (?, ?, ?)`
      ).run(profileId, sharedThemeId, now);

      // Increment favorite count
      db.prepare(
        `UPDATE shared_themes
         SET favorite_count = favorite_count + 1
         WHERE id = ?`
      ).run(sharedThemeId);

      return true;
    } catch (error) {
      // Already favorited or theme doesn't exist
      return false;
    }
  },

  /**
   * Unfavorite a theme
   */
  unfavoriteTheme(profileId: string, sharedThemeId: string): boolean {
    const result = db
      .prepare(
        `DELETE FROM theme_favorites
         WHERE profile_id = ? AND shared_theme_id = ?`
      )
      .run(profileId, sharedThemeId);

    if (result.changes > 0) {
      // Decrement favorite count
      db.prepare(
        `UPDATE shared_themes
         SET favorite_count = MAX(0, favorite_count - 1)
         WHERE id = ?`
      ).run(sharedThemeId);

      return true;
    }

    return false;
  },

  /**
   * Favorite a variation
   */
  favoriteVariation(profileId: string, sharedVariationId: string): boolean {
    const now = new Date().toISOString();

    try {
      db.prepare(
        `INSERT INTO variation_favorites (profile_id, shared_variation_id, created_at)
         VALUES (?, ?, ?)`
      ).run(profileId, sharedVariationId, now);

      // Increment favorite count
      db.prepare(
        `UPDATE shared_variations
         SET favorite_count = favorite_count + 1
         WHERE id = ?`
      ).run(sharedVariationId);

      return true;
    } catch (error) {
      // Already favorited or variation doesn't exist
      return false;
    }
  },

  /**
   * Unfavorite a variation
   */
  unfavoriteVariation(profileId: string, sharedVariationId: string): boolean {
    const result = db
      .prepare(
        `DELETE FROM variation_favorites
         WHERE profile_id = ? AND shared_variation_id = ?`
      )
      .run(profileId, sharedVariationId);

    if (result.changes > 0) {
      // Decrement favorite count
      db.prepare(
        `UPDATE shared_variations
         SET favorite_count = MAX(0, favorite_count - 1)
         WHERE id = ?`
      ).run(sharedVariationId);

      return true;
    }

    return false;
  },

  /**
   * Get user's favorited theme IDs
   */
  getUserFavoriteThemeIds(profileId: string): string[] {
    const rows = db
      .prepare(
        `SELECT shared_theme_id
         FROM theme_favorites
         WHERE profile_id = ?`
      )
      .all(profileId) as Array<{ shared_theme_id: string }>;

    return rows.map((row) => row.shared_theme_id);
  },

  /**
   * Get user's favorited variation IDs
   */
  getUserFavoriteVariationIds(profileId: string): string[] {
    const rows = db
      .prepare(
        `SELECT shared_variation_id
         FROM variation_favorites
         WHERE profile_id = ?`
      )
      .all(profileId) as Array<{ shared_variation_id: string }>;

    return rows.map((row) => row.shared_variation_id);
  },

  /**
   * Check if user has favorited a theme
   */
  isThemeFavorited(profileId: string, sharedThemeId: string): boolean {
    const row = db
      .prepare(
        `SELECT 1 FROM theme_favorites
         WHERE profile_id = ? AND shared_theme_id = ?`
      )
      .get(profileId, sharedThemeId);

    return !!row;
  },

  /**
   * Check if user has favorited a variation
   */
  isVariationFavorited(profileId: string, sharedVariationId: string): boolean {
    const row = db
      .prepare(
        `SELECT 1 FROM variation_favorites
         WHERE profile_id = ? AND shared_variation_id = ?`
      )
      .get(profileId, sharedVariationId);

    return !!row;
  },

  // ==================== USAGE TRACKING ====================

  /**
   * Increment theme usage count
   */
  incrementThemeUsageCount(id: string): void {
    db.prepare(
      `UPDATE shared_themes
       SET usage_count = usage_count + 1
       WHERE id = ?`
    ).run(id);
  },

  /**
   * Increment variation usage count
   */
  incrementVariationUsageCount(id: string): void {
    db.prepare(
      `UPDATE shared_variations
       SET usage_count = usage_count + 1
       WHERE id = ?`
    ).run(id);
  }
});