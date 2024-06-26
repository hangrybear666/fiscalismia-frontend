/* eslint-disable no-console */
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { locales } from '../../utils/localeConfiguration';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { toastOptions } from '../../utils/sharedFunctions';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

interface InputTsvForDbInsertionModalProps {
  id: string;
  postMethod: any;
  btnString: string;
  description: string;
  helperText: string;
}

/**
 * Generic Multi-purpose Dialog Modal for Inserting TSV RAW Data from Google Docs and returning INSERT statements for psql DB.
 * @param props
 * @returns
 */
export default function InputTsvForDbInsertionModal(props: InputTsvForDbInsertionModalProps) {
  const modalId = props.id;
  const postTsvInputMethod = props.postMethod;
  const openModalStr = props.btnString;
  const textAreaDescription = props.description;
  const textAreaHelper = props.helperText;

  const { palette } = useTheme();
  const [open, setOpen] = React.useState(false);
  // Inputs
  const [tsvInput, setTsvInput] = React.useState('');
  // Selection
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '50%',
    width: '600px',
    bgcolor: 'background.paper',
    border: `2px solid ${palette.secondary.main}`,
    boxShadow: 24,
    p: 4
  };
  const transformTsvToInsertStatements = async () => {
    const result = await postTsvInputMethod(tsvInput);
    if (result?.status == 200 && result?.data?.length != 0) {
      toast.success('Insert Statements successfully created.', toastOptions);
      setTsvInput(result.data);
    } else if (result?.data?.length == 0) {
      toast.warn('Response data came back empty. Check Developer console.', toastOptions);
      console.error(result.response);
      setTsvInput('');
    } else if (result?.response?.data?.error) {
      toast.error('Request failed with error. Check Developer console.', toastOptions);
      console.error(result.response.data.error);
      setTsvInput('');
    } else {
      toast.error('TSV conversion failed for unknown reason. Check Developer console.', toastOptions);
      console.log(result.response);
      setTsvInput('');
    }
  };

  const inputChangeListener = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setTsvInput(e.target.value);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="tertiary"
        sx={{
          borderRadius: 0,
          border: `1px solid  ${palette.border.dark}`,
          boxShadow: palette.mode === 'light' ? `3px 3px 8px 2px ${palette.grey[700]}` : '',
          mb: 0.8
        }}
        startIcon={<AddCircleIcon />}
      >
        {openModalStr}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor={modalId}>{textAreaDescription}</InputLabel>
            <Input
              id={modalId}
              value={tsvInput}
              onChange={inputChangeListener}
              multiline
              minRows={15}
              maxRows={30}
              type="text"
            />
            <FormHelperText sx={{ color: palette.secondary.main }}>{textAreaHelper}</FormHelperText>
          </FormControl>
          {/* SAVE */}
          <Button
            onClick={transformTsvToInsertStatements}
            sx={{
              borderRadius: 0,
              margin: '0 auto',
              mt: 2,
              ml: 1,
              border: `1px solid ${palette.border.dark}`,
              width: '100%',
              boxShadow: '3px 3px 5px 2px rgba(64,64,64, 0.7)'
            }}
            variant="contained"
            endIcon={<FileDownloadDoneIcon />}
          >
            {locales().GENERAL_SAVE}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
