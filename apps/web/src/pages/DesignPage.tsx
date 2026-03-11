import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { PageLayout } from "../components/shared/PageLayout";
import { ThemeEditor } from "../components/settings/ThemeEditor";
import { ThemeGallery } from "../components/settings/ThemeGallery";
import { VariationEditor } from "../components/design/VariationEditor";
import { VariationList } from "../components/design/VariationList";

type TabValue = "variations" | "themes";

export const DesignPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("variations");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  // Placeholder handlers - will be wired to services in Phase 7
  const handleVariationSave = () => {
    console.log("Save variation - will be implemented in Phase 7");
  };

  const handleVariationEdit = () => {
    console.log("Edit variation - will be implemented in Phase 7");
  };

  const handleVariationDelete = () => {
    console.log("Delete variation - will be implemented in Phase 7");
  };

  const handleVariationActivate = () => {
    console.log("Activate variation - will be implemented in Phase 7");
  };

  const handleThemeSave = () => {
    console.log("Save theme - will be implemented in Phase 7");
  };

  const handleThemeActivate = () => {
    console.log("Activate theme - will be implemented in Phase 7");
  };

  const handleThemeEdit = () => {
    console.log("Edit theme - will be implemented in Phase 7");
  };

  const handleThemeDelete = () => {
    console.log("Delete theme - will be implemented in Phase 7");
  };

  return (
    <PageLayout>
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Design tabs"
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tab label="Game Variations" value="variations" />
          <Tab label="Theme Editor" value="themes" />
        </Tabs>

        {activeTab === "variations" && (
          <Box>
            <VariationList
              variations={[]}
              onEdit={handleVariationEdit}
              onDelete={handleVariationDelete}
              onActivate={handleVariationActivate}
            />
            <Box sx={{ mt: 4 }}>
              <VariationEditor onSave={handleVariationSave} />
            </Box>
          </Box>
        )}

        {activeTab === "themes" && (
          <Box>
            <ThemeGallery
              themes={[]}
              onActivate={handleThemeActivate}
              onEdit={handleThemeEdit}
              onDelete={handleThemeDelete}
            />
            <Box sx={{ mt: 4 }}>
              <ThemeEditor onSave={handleThemeSave} />
            </Box>
          </Box>
        )}
      </Box>
    </PageLayout>
  );
};
