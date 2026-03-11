import { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { approvedIcons } from "../../theme/approvedIcons";
import { IconActionButton } from "../shared/IconActionButton";
import { ProfileAvatar } from "../shared/ProfileAvatar";

const PhotoCameraIcon = approvedIcons.photoCamera;
const DeleteIcon = approvedIcons.delete;

interface AvatarUploadProps {
  currentAvatar: string | null;
  onAvatarChange: (base64: string | null) => void;
}

export const AvatarUpload = ({ currentAvatar, onAvatarChange }: AvatarUploadProps) => {
  const theme = useTheme();
  const [preview, setPreview] = useState<string | null>(currentAvatar);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 200;
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          
          // Calculate dimensions to maintain aspect ratio
          let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
          if (img.width > img.height) {
            sx = (img.width - img.height) / 2;
            sWidth = img.height;
          } else if (img.height > img.width) {
            sy = (img.height - img.width) / 2;
            sHeight = img.width;
          }
          
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);
          
          const base64 = canvas.toDataURL("image/jpeg", 0.9);
          resolve(base64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB");
      return;
    }

    try {
      const resizedBase64 = await resizeImage(file);
      setPreview(resizedBase64);
      onAvatarChange(resizedBase64);
    } catch (err) {
      setError("Failed to process image");
      console.error(err);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onAvatarChange(null);
    setError("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <ProfileAvatar
        src={preview || undefined}
        size={120}
        iconSize={80}
        bgColor={theme.ui.avatarUpload.avatarBg}
      />

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <input
          ref={fileInputRef}
          accept="image/*"
          type="file"
          hidden
          onChange={handleFileSelect}
          aria-label="Upload avatar image"
        />
        <IconActionButton
          variant="outlined"
          tone="neutral"
          icon={<PhotoCameraIcon />}
          iconColor={theme.icons.photoCamera || theme.icons.default}
          label={preview ? "Change Avatar" : "Upload Avatar"}
          onClick={() => fileInputRef.current?.click()}
        />
        {preview && (
          <IconActionButton
            tone="danger"
            variant="text"
            icon={<DeleteIcon />}
            iconColor={theme.icons.delete || theme.icons.default}
            label="Remove Avatar"
            onClick={handleRemove}
            size="small"
            iconOnly
            sx={{ color: theme.ui.avatarUpload.deleteIcon }}
          />
        )}
      </Box>

      {error && (
        <Typography variant="caption" sx={{ textAlign: "center", color: theme.ui.avatarUpload.errorText }}>
          {error}
        </Typography>
      )}

      <Typography variant="caption" sx={{ textAlign: "center", color: theme.ui.avatarUpload.helperText }}>
        Square images work best. Max 2MB.
      </Typography>
    </Box>
  );
};
