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
  // ==================== Public Reads ====================

  /**
   * Browse shared themes with search/filter/sort
   */
  browseSharedThemes(params: HubSearchParams): {
    themes: SharedThemeWithCreator[];
    total: number;
  } {
    const { query, sortBy = "recent", page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    let orderClause = "ORDER BY st.created_at DESC";
    if (sortBy === "popular") {
      orderClause = "ORDER BY st.usage_count DESC, st.created_at DESC";
    } else if (sortBy === "favorites") {
      orderClause = "ORDER BY st.favorite_count DESC, st.created_at DESC";
    }

    let whereClause = "WHERE 1=1";
    const params_array: any[] = [];

    if (query) {
      whereClause += " AND (st.name LIKE ? OR st.description LIKE ?)";
      const searchPattern = `%${query}%`;
      params_array.push(searchPattern, searchPattern);
    }

    // Get total count
    const countRow = db
      .prepare(
        `SELECT COUNT(*) as count
         FROM shared_themes st
         ${whereClause}`
      )
      .get(...params_array) as { count: number };

    // Get paginated results with creator info
    const rows = db
      .prepare(
        `SELECT 
           st.id, st.creator_profile_id, st.name, st.description,
           st.font_family, st.colors, st.icon_colors,
           st.favorite_count, st.usage_count, st.created_at, st.updated_at,
           p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
         FROM shared_themes st
         INNER JOIN profiles p ON st.creator_profile_id = p.id
         ${whereClause}
         ${orderClause}
         LIMIT ? OFFSET ?`
      )
      .all(...params_array, limit, offset) as Array<{
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

    const themes: SharedThemeWithCreator[] = rows.map((row) => ({
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

    return { themes, total: countRow.count };
  },

  /**
   * Browse shared variations with search/filter/sort
   */
  browseSharedVariations(params: HubSearchParams): {
    variations: SharedVariationWithCreator[];
    total: number;
  } {
    const { query, difficulty, sortBy = "recent", page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    let orderClause = "ORDER BY sv.created_at DESC";
    if (sortBy === "popular") {
      orderClause = "ORDER BY sv.usage_count DESC, sv.created_at DESC";
    } else if (sortBy === "favorites") {
      orderClause = "ORDER BY sv.favorite_count DESC, sv.created_at DESC";
    }

    let whereClause = "WHERE 1=1";
    const params_array: any[] = [];

    if (query) {
      whereClause += " AND (sv.name LIKE ? OR sv.description LIKE ?)";
      const searchPattern = `%${query}%`;
      params_array.push(searchPattern, searchPattern);
    }

    if (difficulty) {
      whereClause += " AND sv.difficulty = ?";
      params_array.push(difficulty);
    }

    // Get total count
    const countRow = db
      .prepare(
        `SELECT COUNT(*) as count
         FROM shared_variations sv
         ${whereClause}`
      )
      .get(...params_array) as { count: number };

    // Get paginated results with creator info
    const rows = db
      .prepare(
        `SELECT 
           sv.id, sv.creator_profile_id, sv.name, sv.description, sv.difficulty,
           sv.base_speed, sv.grid_size, sv.max_concurrent_foods, sv.snake_head_image,
           sv.powerup_types, sv.custom_colors,
           sv.favorite_count, sv.usage_count, sv.created_at, sv.updated_at,
           p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
         FROM shared_variations sv
         INNER JOIN profiles p ON sv.creator_profile_id = p.id
         ${whereClause}
         ${orderClause}
         LIMIT ? OFFSET ?`
      )
      .all(...params_array, limit, offset) as Array<{
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

    const variations: SharedVariationWithCreator[] = rows.map((row) => ({
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

    return { variations, total: countRow.count };
  },

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
         INNER JOIN profiles p ON st.creator_profile_id = p.id
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
         INNER JOIN profiles p ON sv.creator_profile_id = p.id
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

  // ==================== Creator Operations ====================

  /**
   * Share a theme (copy from custom_themes to shared_themes)
   */
  shareTheme(
    creatorProfileId: string,
    themeId: string,
    description?: string
  ): SharedTheme | null {
    // Get the source theme
    const sourceTheme = db
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

    if (!sourceTheme) return null;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO shared_themes (
        id, creator_profile_id, name, description,
        font_family, colors, icon_colors,
        favorite_count, usage_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
    ).run(
      id,
      creatorProfileId,
      sourceTheme.name,
      description || null,
      sourceTheme.font_family,
      sourceTheme.colors,
      sourceTheme.icon_colors,
      now,
      now
    );

    return {
      id,
      creatorProfileId,
      name: sourceTheme.name,
      description: description || undefined,
      fontFamily: sourceTheme.font_family,
      colors: JSON.parse(sourceTheme.colors) as ThemeColors,
      iconColors: JSON.parse(sourceTheme.icon_colors) as ThemeIconColors,
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
    creatorProfileId: string,
    variationId: string,
    description?: string
  ): SharedVariation | null {
    // Get the source variation
    const sourceVariation = db
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

    if (!sourceVariation) return null;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO shared_variations (
        id, creator_profile_id, name, description, difficulty,
        base_speed, grid_size, max_concurrent_foods, snake_head_image,
        powerup_types, custom_colors,
        favorite_count, usage_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
    ).run(
      id,
      creatorProfileId,
      sourceVariation.name,
      description || null,
      sourceVariation.difficulty,
      sourceVariation.base_speed,
      sourceVariation.grid_size,
      sourceVariation.max_concurrent_foods,
      sourceVariation.snake_head_image,
      sourceVariation.powerup_types,
      sourceVariation.custom_colors,
      now,
      now
    );

    return {
      id,
      creatorProfileId,
      name: sourceVariation.name,
      description: description || undefined,
      difficulty: (sourceVariation.difficulty as "easy" | "medium" | "hard") || undefined,
      baseSpeed: sourceVariation.base_speed,
      gridSize: sourceVariation.grid_size,
      maxConcurrentFoods: sourceVariation.max_concurrent_foods,
      snakeHeadImage: sourceVariation.snake_head_image || undefined,
      powerupTypes: JSON.parse(sourceVariation.powerup_types) as PowerupType[],
      customColors: sourceVariation.custom_colors
        ? JSON.parse(sourceVariation.custom_colors)
        : undefined,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Update a shared theme (creator only)
   */
  updateSharedTheme(id: string, creatorProfileId: string, description: string): boolean {
    const result = db
      .prepare(
        `UPDATE shared_themes
         SET description = ?, updated_at = ?
         WHERE id = ? AND creator_profile_id = ?`
      )
      .run(description, new Date().toISOString(), id, creatorProfileId);

    return result.changes > 0;
  },

  /**
   * Update a shared variation (creator only)
   */
  updateSharedVariation(id: string, creatorProfileId: string, description: string): boolean {
    const result = db
      .prepare(
        `UPDATE shared_variations
         SET description = ?, updated_at = ?
         WHERE id = ? AND creator_profile_id = ?`
      )
      .run(description, new Date().toISOString(), id, creatorProfileId);

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

  // ==================== Favorite Operations ====================

  /**
   * Favorite a theme
   */
  favoriteTheme(profileId: string, sharedThemeId: string): boolean {
    try {
      const now = new Date().toISOString();
      db.prepare(
        `INSERT INTO theme_favorites (profile_id, shared_theme_id, created_at)
         VALUES (?, ?, ?)`
      ).run(profileId, sharedThemeId, now);

      // Increment favorite count
      db.prepare(
        `UPDATE shared_themes SET favorite_count = favorite_count + 1 WHERE id = ?`
      ).run(sharedThemeId);

      return true;
    } catch {
      return false; // Already favorited or theme doesn't exist
    }
  },

  /**
   * Unfavorite a theme
   */
  unfavoriteTheme(profileId: string, sharedThemeId: string): boolean {
    const result = db
      .prepare(`DELETE FROM theme_favorites WHERE profile_id = ? AND shared_theme_id = ?`)
      .run(profileId, sharedThemeId);

    if (result.changes > 0) {
      // Decrement favorite count
      db.prepare(
        `UPDATE shared_themes SET favorite_count = MAX(0, favorite_count - 1) WHERE id = ?`
      ).run(sharedThemeId);
      return true;
    }

    return false;
  },

  /**
   * Favorite a variation
   */
  favoriteVariation(profileId: string, sharedVariationId: string): boolean {
    try {
      const now = new Date().toISOString();
      db.prepare(
        `INSERT INTO variation_favorites (profile_id, shared_variation_id, created_at)
         VALUES (?, ?, ?)`
      ).run(profileId, sharedVariationId, now);

      // Increment favorite count
      db.prepare(
        `UPDATE shared_variations SET favorite_count = favorite_count + 1 WHERE id = ?`
      ).run(sharedVariationId);

      return true;
    } catch {
      return false; // Already favorited or variation doesn't exist
    }
  },

  /**
   * Unfavorite a variation
   */
  unfavoriteVariation(profileId: string, sharedVariationId: string): boolean {
    const result = db
      .prepare(
        `DELETE FROM variation_favorites WHERE profile_id = ? AND shared_variation_id = ?`
      )
      .run(profileId, sharedVariationId);

    if (result.changes > 0) {
      // Decrement favorite count
      db.prepare(
        `UPDATE shared_variations SET favorite_count = MAX(0, favorite_count - 1) WHERE id = ?`
      ).run(sharedVariationId);
      return true;
    }

    return false;
  },

  /**
   * Get all favorites for a user
   */
  getUserFavorites(profileId: string): {
    themes: SharedThemeWithCreator[];
    variations: SharedVariationWithCreator[];
  } {
    // Get favorite themes
    const themeRows = db
      .prepare(
        `SELECT 
           st.id, st.creator_profile_id, st.name, st.description,
           st.font_family, st.colors, st.icon_colors,
           st.favorite_count, st.usage_count, st.created_at, st.updated_at,
           p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
         FROM theme_favorites tf
         INNER JOIN shared_themes st ON tf.shared_theme_id = st.id
         INNER JOIN profiles p ON st.creator_profile_id = p.id
         WHERE tf.profile_id = ?
         ORDER BY tf.created_at DESC`
      )
      .all(profileId) as Array<{
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

    const themes: SharedThemeWithCreator[] = themeRows.map((row) => ({
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

    // Get favorite variations
    const variationRows = db
      .prepare(
        `SELECT 
           sv.id, sv.creator_profile_id, sv.name, sv.description, sv.difficulty,
           sv.base_speed, sv.grid_size, sv.max_concurrent_foods, sv.snake_head_image,
           sv.powerup_types, sv.custom_colors,
           sv.favorite_count, sv.usage_count, sv.created_at, sv.updated_at,
           p.id as creator_id, p.name as creator_name, p.avatar_base64 as creator_avatar
         FROM variation_favorites vf
         INNER JOIN shared_variations sv ON vf.shared_variation_id = sv.id
         INNER JOIN profiles p ON sv.creator_profile_id = p.id
         WHERE vf.profile_id = ?
         ORDER BY vf.created_at DESC`
      )
      .all(profileId) as Array<{
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

    const variations: SharedVariationWithCreator[] = variationRows.map((row) => ({
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

    return { themes, variations };
  },

  // ==================== Stats Updates ====================

  /**
   * Increment usage count when a theme is copied
   */
  incrementThemeUsageCount(id: string): void {
    db.prepare(`UPDATE shared_themes SET usage_count = usage_count + 1 WHERE id = ?`).run(id);
  },

  /**
   * Increment usage count when a variation is copied
   */
  incrementVariationUsageCount(id: string): void {
    db.prepare(`UPDATE shared_variations SET usage_count = usage_count + 1 WHERE id = ?`).run(
      id
    );
  }
});