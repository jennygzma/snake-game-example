import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import type { CustomTheme } from "@snake/contracts";

type ThemeGalleryProps = {
  themes: CustomTheme[];
  activeThemeId?: string | null;
  onActivate: (id: string) => void;
  onEdit: (theme: CustomTheme) => void;
  onDelete: (id: string) => void;
};

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
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)"
        },
        gap: 2
      }}
    >
      {themes.map((theme) => {
        const isActive = theme.id === activeThemeId;

        return (
          <Box key={theme.id}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive ? "primary.main" : "divider"
              }}
            >
              {isActive && (
                <Chip
                  label="Active"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {theme.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  {theme.fontFamily.split(",")[0]?.replace(/'/g, "") ?? "Default"}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {Object.entries(theme.colors)
                    .slice(0, 8)
                    .map(([key, color]) => (
                      <Box
                        key={key}
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: color,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 0.5
                        }}
                        title={key}
                      />
                    ))}
                </Stack>
              </CardContent>
              <CardActions>
                {!isActive && (
                  <Button size="small" onClick={() => onActivate(theme.id)}>
                    Activate
                  </Button>
                )}
                <Button size="small" onClick={() => onEdit(theme)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(theme.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
};