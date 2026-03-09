import { Box, Typography, Card, CardContent, CardActions, Button, Chip } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { Panel } from "../shared/Panel";
import { ActionButton } from "../shared/ActionButton";

interface ThemeGalleryProps {
  themes: CustomTheme[];
  activeThemeId?: string | null;
  onActivate: (themeId: string) => void | Promise<void>;
  onEdit: (theme: CustomTheme) => void;
  onDelete: (themeId: string) => void | Promise<void>;
}

export const ThemeGallery = ({
  themes,
  activeThemeId,
  onActivate,
  onEdit,
  onDelete
}: ThemeGalleryProps) => {
  if (themes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No saved themes yet. Create your first custom theme!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 2
      }}
    >
      {themes.map((theme) => {
        const isActive = theme.id === activeThemeId;

        return (
          <Card 
            key={theme.id} 
            sx={{ 
              position: "relative",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)"
              }
            }}
          >
            {isActive && (
              <Chip
                label="Active"
                color="primary"
                size="small"
                sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
              />
            )}

            <CardContent>
              <Typography variant="h6" gutterBottom>
                {theme.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Font: {theme.fontFamily}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Color Preview:
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 0.5,
                    mt: 1
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.snake,
                      borderRadius: 0.5,
                      border: (t) => `1px solid ${t.palette.divider}`
                    }}
                    title="Snake"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.food,
                      borderRadius: 0.5,
                      border: (t) => `1px solid ${t.palette.divider}`
                    }}
                    title="Food"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.action,
                      borderRadius: 0.5,
                      border: (t) => `1px solid ${t.palette.divider}`
                    }}
                    title="Action"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.pause,
                      borderRadius: 0.5,
                      border: (t) => `1px solid ${t.palette.divider}`
                    }}
                    title="Pause"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.danger,
                      borderRadius: 0.5,
                      border: (t) => `1px solid ${t.palette.divider}`
                    }}
                    title="Danger"
                  />
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 1 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => onEdit(theme)} 
                  aria-label={`Edit ${theme.name}`}
                  sx={{ fontWeight: 600 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => onDelete(theme.id)}
                  disabled={isActive}
                  aria-label={`Delete ${theme.name}`}
                >
                  Delete
                </Button>
              </Box>
              {!isActive && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => onActivate(theme.id)}
                  aria-label={`Activate ${theme.name}`}
                  sx={{ fontWeight: 600 }}
                >
                  Activate
                </Button>
              )}
              {isActive && (
                <Chip 
                  label="Applied" 
                  color="success" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};