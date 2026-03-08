import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { CustomTheme } from "@snake/contracts";
import type { ThemeService } from "../../services/themeService";
import { gameTokens } from "../../theme/tokens";

interface ThemeGalleryProps {
  service: ThemeService;
  onThemeChange?: () => void;
}

export const ThemeGallery = ({ service, onThemeChange }: ThemeGalleryProps) => {
  const [themes, setThemes] = useState<CustomTheme[]>([]);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const [themesResponse, activeResponse] = await Promise.all([
        service.getAllThemes(),
        service.getActiveTheme()
      ]);
      setThemes(themesResponse.themes);
      setActiveThemeId(activeResponse.theme?.id || null);
    } catch (err) {
      console.error("Failed to load themes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  const handleApply = async (themeId: string) => {
    try {
      await service.setActiveTheme(themeId);
      setActiveThemeId(themeId);
      onThemeChange?.();
    } catch (err) {
      console.error("Failed to apply theme:", err);
    }
  };

  const handleDelete = async (themeId: string) => {
    if (!confirm("Are you sure you want to delete this theme?")) return;
    
    try {
      await service.deleteTheme(themeId);
      await loadThemes();
      onThemeChange?.();
    } catch (err) {
      console.error("Failed to delete theme:", err);
    }
  };

  if (loading) {
    return <Typography>Loading themes...</Typography>;
  }

  if (themes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
        <Typography variant="body1">No saved themes yet</Typography>
        <Typography variant="body2">Create your first theme above!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {themes.map((theme) => {
        const isActive = theme.id === activeThemeId;
        
        return (
          <Card
            key={theme.id}
            sx={{
              flex: "1 1 300px",
              minWidth: 280,
              maxWidth: 400,
              border: isActive ? 2 : 1,
              borderColor: isActive ? gameTokens.colors.action : "divider",
              position: "relative"
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" component="div" sx={{ fontFamily: theme.fontFamily }}>
                    {theme.name}
                  </Typography>
                  {isActive && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Active"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                    Color Preview:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {[
                      theme.colors.bg,
                      theme.colors.panel,
                      theme.colors.action,
                      theme.colors.snake,
                      theme.colors.food,
                      theme.colors.text
                    ].map((color, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: color,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 0.5
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(theme.createdAt).toLocaleDateString()}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant={isActive ? "outlined" : "contained"}
                    size="small"
                    onClick={() => handleApply(theme.id)}
                    disabled={isActive}
                    fullWidth
                  >
                    {isActive ? "Applied" : "Apply Theme"}
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(theme.id)}
                    aria-label="Delete theme"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};