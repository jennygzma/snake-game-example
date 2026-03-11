import { Box, Typography, Card, CardContent, CardActions, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { CustomTheme } from "@snake/contracts";
import { IconActionButton } from "../shared/IconActionButton";
import { approvedIcons } from "../../theme/approvedIcons";

interface ThemeGalleryProps {
  themes: CustomTheme[];
  activeThemeId?: string | null;
  onActivate: (themeId: string) => void | Promise<void>;
  onEdit: (theme: CustomTheme) => void;
  onDelete: (themeId: string) => void | Promise<void>;
  onShare?: (theme: CustomTheme) => void;
}

export const ThemeGallery = ({
  themes,
  activeThemeId,
  onActivate,
  onEdit,
  onDelete,
  onShare
}: ThemeGalleryProps) => {
  const muiTheme = useTheme();

  if (themes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" sx={{ color: muiTheme.ui.themeGallery.mutedText }}>
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
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  backgroundColor: muiTheme.ui.themeGallery.activeChipBg,
                  color: muiTheme.ui.themeGallery.activeChipText
                }}
              />
            )}

            <CardContent>
              <Typography variant="h6" gutterBottom>
                {theme.name}
              </Typography>

              <Typography variant="body2" sx={{ color: muiTheme.ui.themeGallery.mutedText }} gutterBottom>
                Font: {theme.fontFamily}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: muiTheme.ui.themeGallery.mutedText }}
                  gutterBottom
                  display="block"
                >
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
                      border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
                    }}
                    title="Snake"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.food,
                      borderRadius: 0.5,
                      border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
                    }}
                    title="Food"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.action,
                      borderRadius: 0.5,
                      border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
                    }}
                    title="Action"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.pause,
                      borderRadius: 0.5,
                      border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
                    }}
                    title="Pause"
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: 24,
                      backgroundColor: theme.colors.danger,
                      borderRadius: 0.5,
                      border: `1px solid ${muiTheme.ui.themeGallery.swatchBorder}`
                    }}
                    title="Danger"
                  />
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 1 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                {onShare && (
                  <IconActionButton
                    size="small"
                    variant="outlined"
                    tone="primary"
                    icon={<approvedIcons.add />}
                    iconColor={muiTheme.icons.add || muiTheme.icons.default}
                    label={`Share ${theme.name} to Hub`}
                    iconOnly
                    onClick={() => onShare(theme)}
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <IconActionButton
                  size="small" 
                  variant="outlined"
                  tone="neutral"
                  icon={<approvedIcons.edit />}
                  iconColor={muiTheme.icons.edit || muiTheme.icons.default}
                  label={`Edit ${theme.name}`}
                  iconOnly
                  onClick={() => onEdit(theme)} 
                  sx={{ fontWeight: 600 }}
                />
                <IconActionButton
                  size="small"
                  tone="danger"
                  variant="text"
                  icon={<approvedIcons.delete />}
                  iconColor={muiTheme.icons.delete || muiTheme.icons.default}
                  label={`Delete ${theme.name}`}
                  iconOnly
                  onClick={() => onDelete(theme.id)}
                  disabled={isActive}
                />
              </Box>
              {!isActive && (
                <IconActionButton
                  size="small"
                  variant="contained"
                  tone="primary"
                  icon={<approvedIcons.check />}
                  iconColor={muiTheme.icons.check || muiTheme.icons.default}
                  label={`Activate ${theme.name}`}
                  iconOnly
                  onClick={() => onActivate(theme.id)}
                  sx={{ fontWeight: 600 }}
                />
              )}
              {isActive && (
                <Chip 
                  label="Applied" 
                  size="small"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: muiTheme.ui.themeGallery.appliedChipBg,
                    color: muiTheme.ui.themeGallery.appliedChipText
                  }}
                />
              )}
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};
