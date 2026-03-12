import type { Database } from "better-sqlite3";
import type {
  SharedTheme,
  SharedThemeWithCreator,
  SharedVariation,
  SharedVariationWithCreator,
  HubSearchParams,
  ThemeColors,
  ThemeIconColors,
  PowerupType
} from "@snake/contracts";

export const hubQueries = (db: Database) => ({
  // ============ THEMES ============

  /**
   * Browse shared themes with search, filter, sort, pagination
   */
  browseSharedThemes(
    params: HubSearchParams,
    currentProfileId?: string
  ): { themes: SharedThemeWithCreator[]; total: number } {
    const { query, sortBy = "newest", page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const queryParams: unknown[] = [];

    if (query) {
      whereClause += " AND (st.name LIKE ? OR st.description LIKE ?)";
      const searchPattern = `%${query}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    let orderClause = "ORDER BY st.created_at DESC";
    if (sortBy === "popular") {
      orderClause = "ORDER BY st.usage_count DESC, st.created_at DESC";
    } else if (sortBy === "favorites") {
      orderClause = "ORDER BY st.favorite_count DESC, st.created_at DESC";
    }

    const sql = `
      SELECT 
        st.*,
        p.name as creator_name,
        p.avatar_base64 as creator_avatar,
        ${currentProfileId ? `CASE WHEN tf.profile_id IS NOT NULL THEN 1 ELSE 0 END as is_favorited` : "0 as is_favorited"}
      FROM shared_themes st
      INNER JOIN profiles p ON st.creator_profile_id = p.id
      ${currentProfileId ? `LEFT JOIN theme_favorites tf ON st.id = tf.shared_theme_id AND tf.profile_id = ?` : ""}
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    const sqlParams = currentProfileId 
      ? [currentProfileId, ...queryParams, limit, offset]
      : [...queryParams, limit, offset];

    const rows = db.prepare(sql).all(...sqlParams) as Array<{
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
      creator_name: string;
      creator_avatar: string | null;
      is_favorited: number;
    }>;

    const countSql = `
      SELECT COUNT(*) as total
      FROM shared_themes st
      ${whereClause}
    `;
    const countResult = db.prepare(countSql).get(...queryParams) as { total: number };

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
        profileId: row.creator_profile_id,
        profileName: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      },
      isFavorited: row.is_favorited === 1
    }));

    return { themes, total: countResult.total };
  },

  /**
   * Get a single shared theme by ID
   */
  getSharedTheme(id: string, currentProfileId?: string): SharedThemeWithCreator | null {
    const sql = `
      SELECT 
        st.*,
        p.name as creator_name,
        p.avatar_base64 as creator_avatar,
        ${currentProfileId ? `CASE WHEN tf.profile_id IS NOT NULL THEN 1 ELSE 0 END as is_favorited` : "0 as is_favorited"}
      FROM shared_themes st
      INNER JOIN profiles p ON st.creator_profile_id = p.id
      ${currentProfileId ? `LEFT JOIN theme_favorites tf ON st.id = tf.shared_theme_id AND tf.profile_id = ?` : ""}
      WHERE st.id = ?
    `;

    const params = currentProfileId ? [currentProfileId, id] : [id];
    const row = db.prepare(sql).get(...params) as {
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
      creator_name: string;
      creator_avatar: string | null;
      is_favorited: number;
    } | undefined;

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
        profileId: row.creator_profile_id,
        profileName: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      },
      isFavorited: row.is_favorited === 1
    };
  },

  /**
   * Share a theme (create entry in shared_themes)
   */
  shareTheme(
    creatorProfileId: string,
    themeData: {
      name: string;
      description?: string;
      fontFamily: string;
      colors: ThemeColors;
      iconColors: ThemeIconColors;
    }
  ): SharedTheme {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO shared_themes (
        id, creator_profile_id, name, description, font_family, colors, icon_colors,
        favorite_count, usage_count, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `).run(
      id,
      creatorProfileId,
      themeData.name,
      themeData.description || null,
      themeData.fontFamily,
      JSON.stringify(themeData.colors),
      JSON.stringify(themeData.iconColors),
      now,
      now
    );

    return {
      id,
      creatorProfileId,
      name: themeData.name,
      description: themeData.description,
      fontFamily: themeData.fontFamily,
      colors: themeData.colors,
      iconColors: themeData.iconColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Update a shared theme (creator only)
   */
  updateSharedTheme(
    id: string,
    updates: {
      name?: string;
      description?: string;
      fontFamily?: string;
      colors?: ThemeColors;
      iconColors?: ThemeIconColors;
    }
  ): boolean {
    const now = new Date().toISOString();
    const setClauses: string[] = ["updated_at = ?"];
    const params: unknown[] = [now];

    if (updates.name !== undefined) {
      setClauses.push("name = ?");
      params.push(updates.name);
    }
    if (updates.description !== undefined) {
      setClauses.push("description = ?");
      params.push(updates.description || null);
    }
    if (updates.fontFamily !== undefined) {
      setClauses.push("font_family = ?");
      params.push(updates.fontFamily);
    }
    if (updates.colors !== undefined) {
      setClauses.push("colors = ?");
      params.push(JSON.stringify(updates.colors));
    }
    if (updates.iconColors !== undefined) {
      setClauses.push("icon_colors = ?");
      params.push(JSON.stringify(updates.iconColors));
    }

    params.push(id);

    const result = db.prepare(`
      UPDATE shared_themes
      SET ${setClauses.join(", ")}
      WHERE id = ?
    `).run(...params);

    return result.changes > 0;
  },

  /**
   * Unshare a theme (delete from shared_themes)
   */
  unshareTheme(id: string): boolean {
    const result = db.prepare("DELETE FROM shared_themes WHERE id = ?").run(id);
    return result.changes > 0;
  },

  /**
   * Increment theme usage count
   */
  incrementThemeUsageCount(id: string): void {
    db.prepare("UPDATE shared_themes SET usage_count = usage_count + 1 WHERE id = ?").run(id);
  },

  // ============ VARIATIONS ============

  /**
   * Browse shared variations with search, filter, sort, pagination
   */
  browseSharedVariations(
    params: HubSearchParams,
    currentProfileId?: string
  ): { variations: SharedVariationWithCreator[]; total: number } {
    const { query, difficulty, sortBy = "newest", page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const queryParams: unknown[] = [];

    if (query) {
      whereClause += " AND (sv.name LIKE ? OR sv.description LIKE ?)";
      const searchPattern = `%${query}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    if (difficulty) {
      whereClause += " AND sv.difficulty = ?";
      queryParams.push(difficulty);
    }

    let orderClause = "ORDER BY sv.created_at DESC";
    if (sortBy === "popular") {
      orderClause = "ORDER BY sv.usage_count DESC, sv.created_at DESC";
    } else if (sortBy === "favorites") {
      orderClause = "ORDER BY sv.favorite_count DESC, sv.created_at DESC";
    }

    const sql = `
      SELECT 
        sv.*,
        p.name as creator_name,
        p.avatar_base64 as creator_avatar,
        ${currentProfileId ? `CASE WHEN vf.profile_id IS NOT NULL THEN 1 ELSE 0 END as is_favorited` : "0 as is_favorited"}
      FROM shared_variations sv
      INNER JOIN profiles p ON sv.creator_profile_id = p.id
      ${currentProfileId ? `LEFT JOIN variation_favorites vf ON sv.id = vf.shared_variation_id AND vf.profile_id = ?` : ""}
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    const sqlParams = currentProfileId
      ? [currentProfileId, ...queryParams, limit, offset]
      : [...queryParams, limit, offset];

    const rows = db.prepare(sql).all(...sqlParams) as Array<{
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
      creator_name: string;
      creator_avatar: string | null;
      is_favorited: number;
    }>;

    const countSql = `
      SELECT COUNT(*) as total
      FROM shared_variations sv
      ${whereClause}
    `;
    const countResult = db.prepare(countSql).get(...queryParams) as { total: number };

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
        profileId: row.creator_profile_id,
        profileName: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      },
      isFavorited: row.is_favorited === 1
    }));

    return { variations, total: countResult.total };
  },

  /**
   * Get a single shared variation by ID
   */
  getSharedVariation(id: string, currentProfileId?: string): SharedVariationWithCreator | null {
    const sql = `
      SELECT 
        sv.*,
        p.name as creator_name,
        p.avatar_base64 as creator_avatar,
        ${currentProfileId ? `CASE WHEN vf.profile_id IS NOT NULL THEN 1 ELSE 0 END as is_favorited` : "0 as is_favorited"}
      FROM shared_variations sv
      INNER JOIN profiles p ON sv.creator_profile_id = p.id
      ${currentProfileId ? `LEFT JOIN variation_favorites vf ON sv.id = vf.shared_variation_id AND vf.profile_id = ?` : ""}
      WHERE sv.id = ?
    `;

    const params = currentProfileId ? [currentProfileId, id] : [id];
    const row = db.prepare(sql).get(...params) as {
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
      creator_name: string;
      creator_avatar: string | null;
      is_favorited: number;
    } | undefined;

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
        profileId: row.creator_profile_id,
        profileName: row.creator_name,
        avatarBase64: row.creator_avatar || undefined
      },
      isFavorited: row.is_favorited === 1
    };
  },

  /**
   * Share a variation (create entry in shared_variations)
   */
  shareVariation(
    creatorProfileId: string,
    variationData: {
      name: string;
      description?: string;
      difficulty?: "easy" | "medium" | "hard";
      baseSpeed: number;
      gridSize: number;
      maxConcurrentFoods: number;
      snakeHeadImage?: string;
      powerupTypes: PowerupType[];
      customColors?: {
        snake?: string;
        snakeHead?: string;
        boardBg?: string;
        boardGrid?: string;
      };
    }
  ): SharedVariation {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO shared_variations (
        id, creator_profile_id, name, description, difficulty,
        base_speed, grid_size, max_concurrent_foods, snake_head_image,
        powerup_types, custom_colors, favorite_count, usage_count, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `).run(
      id,
      creatorProfileId,
      variationData.name,
      variationData.description || null,
      variationData.difficulty || null,
      variationData.baseSpeed,
      variationData.gridSize,
      variationData.maxConcurrentFoods,
      variationData.snakeHeadImage || null,
      JSON.stringify(variationData.powerupTypes),
      variationData.customColors ? JSON.stringify(variationData.customColors) : null,
      now,
      now
    );

    return {
      id,
      creatorProfileId,
      name: variationData.name,
      description: variationData.description,
      difficulty: variationData.difficulty,
      baseSpeed: variationData.baseSpeed,
      gridSize: variationData.gridSize,
      maxConcurrentFoods: variationData.maxConcurrentFoods,
      snakeHeadImage: variationData.snakeHeadImage,
      powerupTypes: variationData.powerupTypes,
      customColors: variationData.customColors,
      favoriteCount: 0,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Update a shared variation (creator only)
   */
  updateSharedVariation(
    id: string,
    updates: {
      name?: string;
      description?: string;
      difficulty?: "easy" | "medium" | "hard";
      baseSpeed?: number;
      gridSize?: number;
      maxConcurrentFoods?: number;
      snakeHeadImage?: string;
      powerupTypes?: PowerupType[];
      customColors?: {
        snake?: string;
        snakeHead?: string;
        boardBg?: string;
        boardGrid?: string;
      };
    }
  ): boolean {
    const now = new Date().toISOString();
    const setClauses: string[] = ["updated_at = ?"];
    const params: unknown[] = [now];

    if (updates.name !== undefined) {
      setClauses.push("name = ?");
      params.push(updates.name);
    }
    if (updates.description !== undefined) {
      setClauses.push("description = ?");
      params.push(updates.description || null);
    }
    if (updates.difficulty !== undefined) {
      setClauses.push("difficulty = ?");
      params.push(updates.difficulty || null);
    }
    if (updates.baseSpeed !== undefined) {
      setClauses.push("base_speed = ?");
      params.push(updates.baseSpeed);
    }
    if (updates.gridSize !== undefined) {
      setClauses.push("grid_size = ?");
      params.push(updates.gridSize);
    }
    if (updates.maxConcurrentFoods !== undefined) {
      setClauses.push("max_concurrent_foods = ?");
      params.push(updates.maxConcurrentFoods);
    }
    if (updates.snakeHeadImage !== undefined) {
      setClauses.push("snake_head_image = ?");
      params.push(updates.snakeHeadImage || null);
    }
    if (updates.powerupTypes !== undefined) {
      setClauses.push("powerup_types = ?");
      params.push(JSON.stringify(updates.powerupTypes));
    }
    if (updates.customColors !== undefined) {
      setClauses.push("custom_colors = ?");
      params.push(updates.customColors ? JSON.stringify(updates.customColors) : null);
    }

    params.push(id);

    const result = db.prepare(`
      UPDATE shared_variations
      SET ${setClauses.join(", ")}
      WHERE id = ?
    `).run(...params);

    return result.changes > 0;
  },

  /**
   * Unshare a variation (delete from shared_variations)
   */
  unshareVariation(id: string): boolean {
    const result = db.prepare("DELETE FROM shared_variations WHERE id = ?").run(id);
    return result.changes > 0;
  },

  /**
   * Increment variation usage count
   */
  incrementVariationUsageCount(id: string): void {
    db.prepare("UPDATE shared_variations SET usage_count = usage_count + 1 WHERE id = ?").run(id);
  },

  // ============ FAVORITES ============

  /**
   * Favorite a theme
   */
  favoriteTheme(profileId: string, sharedThemeId: string): boolean {
    const now = new Date().toISOString();
    try {
      db.prepare(`
        INSERT INTO theme_favorites (profile_id, shared_theme_id, created_at)
        VALUES (?, ?, ?)
      `).run(profileId, sharedThemeId, now);

      db.prepare(`
        UPDATE shared_themes SET favorite_count = favorite_count + 1 WHERE id = ?
      `).run(sharedThemeId);

      return true;
    } catch {
      return false; // Already favorited
    }
  },

  /**
   * Unfavorite a theme
   */
  unfavoriteTheme(profileId: string, sharedThemeId: string): boolean {
    const result = db.prepare(`
      DELETE FROM theme_favorites WHERE profile_id = ? AND shared_theme_id = ?
    `).run(profileId, sharedThemeId);

    if (result.changes > 0) {
      db.prepare(`
        UPDATE shared_themes SET favorite_count = favorite_count - 1 WHERE id = ?
      `).run(sharedThemeId);
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
      db.prepare(`
        INSERT INTO variation_favorites (profile_id, shared_variation_id, created_at)
        VALUES (?, ?, ?)
      `).run(profileId, sharedVariationId, now);

      db.prepare(`
        UPDATE shared_variations SET favorite_count = favorite_count + 1 WHERE id = ?
      `).run(sharedVariationId);

      return true;
    } catch {
      return false; // Already favorited
    }
  },

  /**
   * Unfavorite a variation
   */
  unfavoriteVariation(profileId: string, sharedVariationId: string): boolean {
    const result = db.prepare(`
      DELETE FROM variation_favorites WHERE profile_id = ? AND shared_variation_id = ?
    `).run(profileId, sharedVariationId);

    if (result.changes > 0) {
      db.prepare(`
        UPDATE shared_variations SET favorite_count = favorite_count - 1 WHERE id = ?
      `).run(sharedVariationId);
      return true;
    }
    return false;
  },

  /**
   * Get user's favorited theme and variation IDs
   */
  getUserFavorites(profileId: string): { themes: string[]; variations: string[] } {
    const themes = db.prepare(`
      SELECT shared_theme_id FROM theme_favorites WHERE profile_id = ?
    `).all(profileId) as Array<{ shared_theme_id: string }>;

    const variations = db.prepare(`
      SELECT shared_variation_id FROM variation_favorites WHERE profile_id = ?
    `).all(profileId) as Array<{ shared_variation_id: string }>;

    return {
      themes: themes.map((t) => t.shared_theme_id),
      variations: variations.map((v) => v.shared_variation_id)
    };
  }
});