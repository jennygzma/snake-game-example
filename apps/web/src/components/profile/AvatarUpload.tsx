import { useState, useRef, ChangeEvent } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { approvedIcons } from "../../theme/approvedIcons";

type AvatarUploadProps = {
  value: string | null | undefined;
  onChange: (base64: string | null) => void;
};

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const TARGET_SIZE = 200;

export const AvatarUpload = ({ value, onChange }: AvatarUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be less than 2MB");
      return;
    }

    try {
      // Load image
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = objectUrl;
      });

      // Create canvas and resize
      const canvas = document.createElement("canvas");
      canvas.width = TARGET_SIZE;
      canvas.height = TARGET_SIZE;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Failed to process image");
        return;
      }

      // Calculate crop to fit square
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      ctx.drawImage(img, x, y, size, size, 0, 0, TARGET_SIZE, TARGET_SIZE);
      
      // Convert to base64
      const base64 = canvas.toDataURL("image/jpeg", 0.9);
      onChange(base64);

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError("Failed to process image");
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="body2" gutterBottom>
          Profile Picture
        </Typography>
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            overflow: "hidden",
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {value ? (
            <img src={value} alt="Profile avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <approvedIcons.accountCircle sx={{ fontSize: 80, color: "action.active" }} />
          )}
        </Box>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-label="Upload profile picture"
      />

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => fileInputRef.current?.click()}
        >
          {value ? "Change" : "Upload"}
        </Button>
        {value && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
      </Stack>

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary">
        Max 2MB. Image will be cropped to square.
      </Typography>
    </Stack>
  );
};