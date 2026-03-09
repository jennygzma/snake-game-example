import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

type DeleteProfileDialogProps = {
  open: boolean;
  profileName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteProfileDialog = ({ open, profileName, onConfirm, onCancel }: DeleteProfileDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Profile</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{profileName}</strong>?
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This will permanently delete all themes and scores associated with this profile.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};