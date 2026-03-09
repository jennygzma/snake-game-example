import { useState, useRef, ChangeEvent } from "react";
import { Box, Button, Avatar, Typography, Stack } from "@mui/material";
import { AccountCircle, PhotoCamera } from "@mui/icons-material";

interface AvatarUploadProps {
  currentAvatar: string | null | undefined;
  onAvatarChange: (base64: string | null) => void;
  size?: number;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const TARGET_SIZE = 200; // Resize to 200x200

export const AvatarUpload = ({ currentAvatar, onAvatarChange, size = 120 }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

          // Calculate crop dimensions to maintain aspect ratio
          const aspectRatio = img.width / img.height;
          let drawWidth = TARGET_SIZE;
          let drawHeight = TARGET_SIZE;
          let offsetX = 0;
          let offsetY = 0;

          if (aspectRatio > 1) {
            // Wider than tall
            drawWidth = TARGET_SIZE * aspectRatio;
            offsetX = -(drawWidth - TARGET_SIZE) / 2;
          } else {
            // Taller than wide
            drawHeight = TARGET_SIZE / aspectRatio;
            offsetY = -(drawHeight - TARGET_SIZE) / 2;
          }

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 2MB");
      return;
    }

    try {
      const base64 = await resizeImage(file);
      setPreview(base64);
      onAvatarChange(base64);
    } catch (err) {
      setError("Failed to process image");
      console.error("Image processing error:", err);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Box sx={{ position: "relative" }}>
        {preview ? (
          <Avatar
            src={preview}
            sx={{
              width: size,
              height: size,
              border: (theme) => `2px solid ${theme.palette.divider}`
            }}
          />
        ) : (
          <AccountCircle
            sx={{
              width: size,
              height: size,
              color: "text.secondary"
            }}
          />
        )}
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PhotoCamera />}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? "Change" : "Upload"}
        </Button>
        {preview && (
          <Button variant="outlined" size="small" color="error" onClick={handleRemove}>
            Remove
          </Button>
        )}
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary">
        Max 2MB • Will be resized to 200x200
      </Typography>
    </Stack>
  );
};