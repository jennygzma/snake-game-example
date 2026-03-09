import { Box, Button, Avatar, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRef, useState } from "react";
import { approvedIcons } from "../../theme/approvedIcons";

const PhotoCameraIcon = approvedIcons.photoCamera;
const DeleteIcon = approvedIcons.delete;
const AccountCircleIcon = approvedIcons.accountCircle;

interface AvatarUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const TARGET_SIZE = 200; // 200x200px

export const AvatarUpload = ({ value, onChange }: AvatarUploadProps) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = TARGET_SIZE;
          canvas.height = TARGET_SIZE;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Calculate dimensions to maintain aspect ratio and crop to square
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;

          ctx.drawImage(img, x, y, size, size, 0, 0, TARGET_SIZE, TARGET_SIZE);

          resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be less than 2MB");
      return;
    }

    try {
      const resizedBase64 = await resizeImage(file);
      onChange(resizedBase64);
    } catch (err) {
      setError("Failed to process image");
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <Avatar
        src={value || undefined}
        sx={{
          width: 120,
          height: 120,
          backgroundColor: theme.palette.primary.main
        }}
      >
        {!value && <AccountCircleIcon sx={{ fontSize: 120 }} />}
      </Avatar>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<PhotoCameraIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          {value ? "Change Avatar" : "Upload Avatar"}
        </Button>

        {value && (
          <IconButton onClick={handleRemove} aria-label="Remove avatar" color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-label="Avatar file input"
      />

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      {!error && (
        <Typography variant="caption" color="text.secondary">
          Recommended: Square image, max 2MB
        </Typography>
      )}
    </Box>
  );
};