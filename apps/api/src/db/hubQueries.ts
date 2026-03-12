import type { Database } from "better-sqlite3";
import type {
  SharedTheme,
  SharedVariation,
  HubThemeWithCreator,
  HubVariationWithCreator,
  HubSearchParams,
  ThemeColors,
  ThemeIconColors,
  PowerupType
} from "@snake/contracts";
import { themeQueries } from "./themeQueries";
import { variationQueries } from "./variationQueries";

interface DbSharedTheme {
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
}

interface DbSharedVariation {
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
}

interface DbProfile {
  id: string;
  name: string;
  avatar_base64: string | null;
}

export const hubQueries = (db: Database) => {
  const themeQs = themeQueries(db);
  const variationQs = variationQueries(db);

  return {
    // ========================================================================
    // Public Reads - Themes
    // ========================================================================

    /**
     * Browse shared themes with pagination and filtering
     */
    browseSharedThemes(params: HubSearchParams, requestingProfileId?: string): {
      themes: HubThemeWithCreator[];
      total: number;
    } {
      const { query, sortBy = "recent", page = 1, limit = 20 } = params;
      const offset = (page - 1) * limit;

      // Build WHERE clause
      let whereClause = "WHERE 1=1";
      const whereParams: any[] = [];

      if (query) {
        whereClause += " AND (st.name LIKE ? OR st.description LIKE ?)";
        const searchPattern = `%${query}%`;
        whereParams.push(searchPattern, searchPattern);
      }

      // Build ORDER BY clause
      let orderBy = "";
      switch (sortBy) {
        case "popular":
          orderBy = "ORDER BY st.usage_count DESC, st.created_at DESC";
          break;
        case "favorites":
          orderBy = "ORDER BY st.favorite_count DESC, st.created_at DESC";
          break;
        case "recent":
        default:
          orderBy = "ORDER BY st.created_at DESC";
          break;
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM shared_themes st
        ${whereClause}
      `;
      const countResult = db.prepare(countQuery).get(...whereParams) as { total: number };

      // Get paginated results with creator info
      const query_str = `
        SELECT 
          st.*,
          p.id as creator_id,
          p.name as creator_name,
          p.avatar_base64 as creator_avatar
        FROM shared_themes st
        JOIN profiles p ON st.creator_profile_id = p.id
        ${whereClause}
        ${orderBy}
        LIMIT ? OFFSET ?
      `;

      const rows = db.prepare(query_str).all(...whereParams, limit, offset) as Array<
        DbSharedTheme & {
          creator_id: string;
          creator_name: string;
          creator_avatar: string | null;
        }
      >;

      const themes: HubThemeWithCreator[] = rows.map((row) => {
        // Check if requesting profile has favorited this theme
        let isFavorited = false;
        if (requestingProfileId) {
          const fav = db
            .prepare(
              `SELECT 1 FROM theme_favorites 
               WHERE profile_id = ? AND shared_theme_id = ?`
            )
            .get(requestingProfileId, row.id);
          isFavorited = !!fav;
        }

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
            profileId: row.creator_id,
            profileName: row.creator_name,
            profileAvatar: row.creator_avatar || undefined
          },
          isFavorited
        };
      });

      return {
        themes,
        total: countResult.total
      };
    },

    /**
     * Get a specific shared theme by ID
     */
    getSharedTheme(id: string, requestingProfileId?: string): HubThemeWithCreator | null {
      const row = db
        .prepare(
          `SELECT 
             st.*,
             p.id as creator_id,
             p.name as creator_name,
             p.avatar_base64 as creator_avatar
           FROM shared_themes st
           JOIN profiles p ON st.creator_profile_id = p.id
           WHERE st.id = ?`
        )
        .get(id) as
        | (DbSharedTheme & {
            creator_id: string;
            creator_name: string;
            creator_avatar: string | null;
          })
        | undefined;

      if (!row) return null;

      let isFavorited = false;
      if (requestingProfileId) {
        const fav = db
          .prepare(
            `SELECT 1 FROM theme_favorites 
             WHERE profile_id = ? AND shared_theme_id = ?`
          )
          .get(requestingProfileId, row.id);
        isFavorited = !!fav;
      }

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
          profileId: row.creator_id,
          profileName: row.creator_name,
          profileAvatar: row.creator_avatar || undefined
        },
        isFavorited
      };
    },

    // ========================================================================
    // Public Reads - Variations
    // ========================================================================

    /**
     * Browse shared variations with pagination and filtering
     */
    browseSharedVariations(params: HubSearchParams, requestingProfileId?: string): {
      variations: HubVariationWithCreator[];
      total: number;
    } {
      const { query, difficulty, sortBy = "recent", page = 1, limit = 20 } = params;
      const offset = (page - 1) * limit;

      // Build WHERE clause
      let whereClause = "WHERE 1=1";
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

      // Build ORDER BY clause
      let orderBy = "";
      switch (sortBy) {
        case "popular":
          orderBy = "ORDER BY sv.usage_count DESC, sv.created_at DESC";
          break;
        case "favorites":
          orderBy = "ORDER BY sv.favorite_count DESC, sv.created_at DESC";
          break;
        case "recent":
        default:
          orderBy = "ORDER BY sv.created_at DESC";
          break;
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM shared_variations sv
        ${whereClause}
      `;
      const countResult = db.prepare(countQuery).get(...whereParams) as { total: number };

      // Get paginated results with creator info
      const query_str = `
        SELECT 
          sv.*,
          p.id as creator_id,
          p.name as creator_name,
          p.avatar_base64 as creator_avatar
        FROM shared_variations sv
        JOIN profiles p ON sv.creator_profile_id = p.id
        ${whereClause}
        ${orderBy}
        LIMIT ? OFFSET ?
      `;

      const rows = db.prepare(query_str).all(...whereParams, limit, offset) as Array<
        DbSharedVariation & {
          creator_id: string;
          creator_name: string;
          creator_avatar: string | null;
        }
      >;

      const variations: HubVariationWithCreator[] = rows.map((row) => {
        let isFavorited = false;
        if (requestingProfileId) {
          const fav = db
            .prepare(
              `SELECT 1 FROM variation_favorites 
               WHERE profile_id = ? AND shared_variation_id = ?`
            )
            .get(requestingProfileId, row.id);
          isFavorited = !!fav;
        }

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
            profileId: row.creator_id,
            profileName: row.creator_name,
            profileAvatar: row.creator_avatar || undefined
          },
          isFavorited
        };
      });

      return {
        variations,
        total: countResult.total
      };
    },

    /**
     * Get a specific shared variation by ID
     */
    getSharedVariation(id: string, requestingProfileId?: string): HubVariationWithCreator | null {
      const row = db
        .prepare(
          `SELECT 
             sv.*,
             p.id as creator_id,
             p.name as creator_name,
             p.avatar_base64 as creator_avatar
           FROM shared_variations sv
           JOIN profiles p ON sv.creator_profile_id = p.id
           WHERE sv.id = ?`
        )
        .get(id) as
        | (DbSharedVariation & {
            creator_id: string;
            creator_name: string;
            creator_avatar: string | null;
          })
        | undefined;

      if (!row) return null;

      let isFavorited = false;
      if (requestingProfileId) {
        const fav = db
          .prepare(
            `SELECT 1 FROM variation_favorites 
             WHERE profile_id = ? AND shared_variation_id = ?`
          )
          .get(requestingProfileId, row.id);
        isFavorited = !!fav;
      }

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
          profileId: row.creator_id,
          profileName: row.creator_name,
          profileAvatar: row.creator_avatar || undefined
        },
        isFavorited
      };
    },

    // ========================================================================
    // Creator Operations - Themes
    // ========================================================================

    /**
     * Share a theme to the hub
     */
    shareTheme(creatorProfileId: string, themeId: string, description?: string): SharedTheme {
      const theme = themeQs.getById(themeId);
      if (!theme) {
        throw new Error("Theme not found");
      }

      const sharedId = crypto.randomUUID();
      const now = new Date().toISOString();

      db.prepare(
        `INSERT INTO shared_themes (
          id, creator_profile_id, name, description, font_family,
          colors, icon_colors, favorite_count, usage_count,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
      ).run(
        sharedId,
        creatorProfileId,
        theme.name,
        description || null,
        theme.fontFamily,
        JSON.stringify(theme.colors),
        JSON.stringify(theme.iconColors),
        now,
        now
      );

      return {
        id: sharedId,
        creatorProfileId,
        name: theme.name,
        description,
        fontFamily: theme.fontFamily,
        colors: theme.colors,
        iconColors: theme.iconColors,
        favoriteCount: 0,
        usageCount: 0,
        createdAt: now,
        updatedAt: now
      };
    },

    /**
     * Update a shared theme
     */
    updateSharedTheme(id: string, description?: string): SharedTheme | null {
      const existing = db
        .prepare(`SELECT * FROM shared_themes WHERE id = ?`)
        .get(id) as DbSharedTheme | undefined;

      if (!existing) return null;

      const now = new Date().toISOString();

      db.prepare(
        `UPDATE shared_themes SET description = ?, updated_at = ? WHERE id = ?`
      ).run(description || null, now, id);

      return {
        id: existing.id,
        creatorProfileId: existing.creator_profile_id,
        name: existing.name,
        description,
        fontFamily: existing.font_family,
        colors: JSON.parse(existing.colors) as ThemeColors,
        iconColors: JSON.parse(existing.icon_colors) as ThemeIconColors,
        favoriteCount: existing.favorite_count,
        usageCount: existing.usage_count,
        createdAt: existing.created_at,
        updatedAt: now
      };
    },

    /**
     * Unshare a theme from the hub
     */
    unshareTheme(id: string): boolean {
      const result = db.prepare(`DELETE FROM shared_themes WHERE id = ?`).run(id);
      return result.changes > 0;
    },

    // ========================================================================
    // Creator Operations - Variations
    // ========================================================================

    /**
     * Share a variation to the hub
     */
    shareVariation(
      creatorProfileId: string,
      variationId: string,
      description?: string
    ): SharedVariation {
      const variation = variationQs.getVariationById(variationId);
      if (!variation) {
        throw new Error("Variation not found");
      }

      const sharedId = crypto.randomUUID();
      const now = new Date().toISOString();

      db.prepare(
        `INSERT INTO shared_variations (
          id, creator_profile_id, name, description, difficulty,
          base_speed, grid_size, max_concurrent_foods, snake_head_image,
          powerup_types, custom_colors, favorite_count, usage_count,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
      ).run(
        sharedId,
        creatorProfileId,
        variation.name,
        description || null,
        variation.difficulty || null,
        variation.baseSpeed,
        variation.gridSize,
        variation.maxConcurrentFoods,
        variation.snakeHeadImage || null,
        JSON.stringify(variation.powerupTypes),
        variation.customColors ? JSON.stringify(variation.customColors) : null,
        now,
        now
      );

      return {
        id: sharedId,
        creatorProfileId,
        name: variation.name,
        description,
        difficulty: variation.difficulty,
        baseSpeed: variation.baseSpeed,
        gridSize: variation.gridSize,
        maxConcurrentFoods: variation.maxConcurrentFoods,
        snakeHeadImage: variation.snakeHeadImage,
        powerupTypes: variation.powerupTypes,
        customColors: variation.customColors,
        favoriteCount: 0,
        usageCount: 0,
        createdAt: now,
        updatedAt: now
      };
    },

    /**
     * Update a shared variation
     */
    updateSharedVariation(id: string, description?: string): SharedVariation | null {
      const existing = db
        .prepare(`SELECT * FROM shared_variations WHERE id = ?`)
        .get(id) as DbSharedVariation | undefined;

      if (!existing) return null;

      const now = new Date().toISOString();

      db.prepare(
        `UPDATE shared_variations SET description = ?, updated_at = ? WHERE id = ?`
      ).run(description || null, now, id);

      return {
        id: existing.id,
        creatorProfileId: existing.creator_profile_id,
        name: existing.name,
        description,
        difficulty: (existing.difficulty as "easy" | "medium" | "hard") || undefined,
        baseSpeed: existing.base_speed,
        gridSize: existing.grid_size,
        maxConcurrentFoods: existing.max_concurrent_foods,
        snakeHeadImage: existing.snake_head_image || undefined,
        powerupTypes: JSON.parse(existing.powerup_types) as PowerupType[],
        customColors: existing.custom_colors ? JSON.parse(existing.custom_colors) : undefined,
        favoriteCount: existing.favorite_count,
        usageCount: existing.usage_count,
        createdAt: existing.created_at,
        updatedAt: now
      };
    },

    /**
     * Unshare a variation from the hub
     */
    unshareVariation(id: string): boolean {
      const result = db.prepare(`DELETE FROM shared_variations WHERE id = ?`).run(id);
      return result.changes > 0;
    },

    // ========================================================================
    // Favorite Operations
    // ========================================================================

    /**
     * Favorite a theme
     */
    favoriteTheme(profileId: string, sharedThemeId: string): void {
      const now = new Date().toISOString();

      // Check if already favorited
      const existing = db
        .prepare(
          `SELECT 1 FROM theme_favorites 
           WHERE profile_id = ? AND shared_theme_id = ?`
        )
        .get(profileId, sharedThemeId);

      if (existing) return; // Already favorited

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
    },

    /**
     * Unfavorite a theme
     */
    unfavoriteTheme(profileId: string, sharedThemeId: string): void {
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
      }
    },

    /**
     * Favorite a variation
     */
    favoriteVariation(profileId: string, sharedVariationId: string): void {
      const now = new Date().toISOString();

      // Check if already favorited
      const existing = db
        .prepare(
          `SELECT 1 FROM variation_favorites 
           WHERE profile_id = ? AND shared_variation_id = ?`
        )
        .get(profileId, sharedVariationId);

      if (existing) return; // Already favorited

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
    },

    /**
     * Unfavorite a variation
     */
    unfavoriteVariation(profileId: string, sharedVariationId: string): void {
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
      }
    },

    /**
     * Get all favorites for a user
     */
    getUserFavorites(profileId: string): {
      themes: HubThemeWithCreator[];
      variations: HubVariationWithCreator[];
    } {
      // Get favorited themes
      const themeRows = db
        .prepare(
          `SELECT 
             st.*,
             p.id as creator_id,
             p.name as creator_name,
             p.avatar_base64 as creator_avatar
           FROM theme_favorites tf
           JOIN shared_themes st ON tf.shared_theme_id = st.id
           JOIN profiles p ON st.creator_profile_id = p.id
           WHERE tf.profile_id = ?
           ORDER BY tf.created_at DESC`
        )
        .all(profileId) as Array<
        DbSharedTheme & {
          creator_id: string;
          creator_name: string;
          creator_avatar: string | null;
        }
      >;

      const themes: HubThemeWithCreator[] = themeRows.map((row) => ({
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
          profileId: row.creator_id,
          profileName: row.creator_name,
          profileAvatar: row.creator_avatar || undefined
        },
        isFavorited: true
      }));

      // Get favorited variations
      const variationRows = db
        .prepare(
          `SELECT 
             sv.*,
             p.id as creator_id,
             p.name as creator_name,
             p.avatar_base64 as creator_avatar
           FROM variation_favorites vf
           JOIN shared_variations sv ON vf.shared_variation_id = sv.id
           JOIN profiles p ON sv.creator_profile_id = p.id
           WHERE vf.profile_id = ?
           ORDER BY vf.created_at DESC`
        )
        .all(profileId) as Array<
        DbSharedVariation & {
          creator_id: string;
          creator_name: string;
          creator_avatar: string | null;
        }
      >;

      const variations: HubVariationWithCreator[] = variationRows.map((row) => ({
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
          profileId: row.creator_id,
          profileName: row.creator_name,
          profileAvatar: row.creator_avatar || undefined
        },
        isFavorited: true
      }));

      return { themes, variations };
    },

    // ========================================================================
    // Copy Operations
    // ========================================================================

    /**
     * Copy a shared theme to local profile themes
     */
    copyThemeToLocal(sharedThemeId: string, targetProfileId: string, customName?: string): string {
      const sharedTheme = this.getSharedTheme(sharedThemeId);
      if (!sharedTheme) {
        throw new Error("Shared theme not found");
      }

      // Increment usage count
      db.prepare(
        `UPDATE shared_themes 
         SET usage_count = usage_count + 1 
         WHERE id = ?`
      ).run(sharedThemeId);

      // Create local copy
      const localTheme = themeQs.create("user", targetProfileId, {
        name: customName || `${sharedTheme.name} (Copy)`,
        fontFamily: sharedTheme.fontFamily,
        colors: sharedTheme.colors,
        iconColors: sharedTheme.iconColors
      });

      return localTheme.id;
    },

    /**
     * Copy a shared variation to local profile variations
     */
    copyVariationToLocal(
      sharedVariationId: string,
      targetProfileId: string,
      customName?: string
    ): string {
      const sharedVariation = this.getSharedVariation(sharedVariationId);
      if (!sharedVariation) {
        throw new Error("Shared variation not found");
      }

      // Increment usage count
      db.prepare(
        `UPDATE shared_variations 
         SET usage_count = usage_count + 1 
         WHERE id = ?`
      ).run(sharedVariationId);

      // Create local copy
      const localVariation = variationQs.createVariation(targetProfileId, {
        name: customName || `${sharedVariation.name} (Copy)`,
        description: sharedVariation.description,
        difficulty: sharedVariation.difficulty,
        baseSpeed: sharedVariation.baseSpeed,
        gridSize: sharedVariation.gridSize,
        maxConcurrentFoods: sharedVariation.maxConcurrentFoods,
        snakeHeadImage: sharedVariation.snakeHeadImage,
        powerupTypes: sharedVariation.powerupTypes,
        customColors: sharedVariation.customColors
      });

      return localVariation.id;
    }
  };
};