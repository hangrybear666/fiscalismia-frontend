import React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Unstable_Grid2';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import { resourceProperties as res } from '../../resources/resource_properties';

interface ConfirmationDialogProps {
  title: string;
  text: string;
  textColor: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => Promise<void>;
  confirmBtnText: string;
}
export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { palette } = useTheme();
  const { title, text, textColor, open, setOpen, handleConfirm, confirmBtnText } = props;

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    handleConfirm();
    setOpen(false);
  };

  const buttonStyle = {
    borderRadius: 0,
    border: `1px solid  ${palette.mode === 'light' ? palette.border.dark : palette.border.light}`,
    boxShadow: palette.mode === 'light' ? `3px 3px 8px 2px ${palette.grey[700]}` : ''
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography
            variant="overline"
            sx={{ fontSize: 16, paddingX: 2 }}
            color={textColor ? textColor : 'text.primary'}
          >
            {text}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 1, display: 'inline-block' }}>
          <Grid container spacing={1}>
            <Grid xs={6}>
              <Button
                sx={buttonStyle}
                fullWidth={true}
                color="error"
                variant="contained"
                size="large"
                onClick={handleCancel}
              >
                {res.CANCEL}
              </Button>
            </Grid>
            <Grid xs={6}>
              <Button
                sx={buttonStyle}
                fullWidth={true}
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOk}
              >
                {confirmBtnText ? confirmBtnText : res.OK}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}
