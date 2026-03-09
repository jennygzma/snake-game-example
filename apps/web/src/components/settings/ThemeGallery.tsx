import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";
import type { CustomTheme } from "@snake/contracts";
import { Panel } from "../shared/Panel";

type ThemeGalleryProps = {
  themes: CustomTheme[];
  activeThemeId: string | null;
  onActivate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const ThemeGallery = ({ themes, activeThemeId, onActivate, onEdit, onDelete }: ThemeGalleryProps) => {
  if (themes.length === 0) {
    return (
      <Panel>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No saved themes yet. Create your first custom theme above!
        </Typography>
      </Panel>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Saved Themes</Typography>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)"
          }
        }}
      >
        {themes.map((theme) => (
          <Card key={theme.id} variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {theme.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                {theme.fontFamily}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 0.5,
                  mt: 1
                }}
              >
                {Object.entries(theme.colors)
                  .slice(0, 8)
                  .map(([key, color]) => (
                    <Box
                      key={key}
                      sx={{
                        width: "100%",
                        height: 24,
                        backgroundColor: color,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 0.5
                      }}
                      title={`${key}: ${color}`}
                    />
                  ))}
              </Box>
              {theme.isActive && (
                <Typography variant="caption" color="primary.main" sx={{ display: "block", mt: 1 }}>
                  ✓ Active
                </Typography>
              )}
            </CardContent>
            <CardActions>
              {!theme.isActive && (
                <Button size="small" onClick={() => onActivate(theme.id)}>
                  Activate
                </Button>
              )}
              <Button size="small" onClick={() => onEdit(theme.id)}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={() => onDelete(theme.id)} disabled={theme.isActive}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};