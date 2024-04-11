import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { resourceProperties as res } from '../../resources/resource_properties';
import { createUserCredentials } from '../../services/pgConnections';
import { UserCredentials } from '../../types/custom/customTypes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const regExEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function CreateAccountModal() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  // Validation
  const [isUsernameValidationError, setIsUsernameValidationError] = React.useState(false);
  const [usernameValidationErrorMessage, setUsernameValidationErrorMessage] = React.useState('');
  const [isPasswordValidationError, setIsPasswordValidationError] = React.useState(false);
  const [passwordValidationErrorMessage, setPasswordValidationErrorMessage] = React.useState('');
  const [isEmailValidationError, setIsEmailValidationError] = React.useState(false);
  const [emailValidationErrorMessage, setEmailValidationErrorMessage] = React.useState('');
  // Inputs
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**
   * queries DB for food item discount information insertion via REST API
   * notifies user on success or error
   */
  const persistUserCredentialsAndSettings = async () => {
    const credentials: UserCredentials = { username, email, password };
    console.log(credentials);
    const response = await createUserCredentials(credentials);
    if (response?.results[0]?.username == username) {
      // TODO User Notification
      console.log('SUCCESSFULLY added user account to DB');
      setOpen(false);
      navigate(0);
    } else {
      // TODO User Notification
      console.error(response);
    }
  };

  const validateInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let errorPresent = false;
    if (!username) {
      errorPresent = true;
      setIsUsernameValidationError(true);
      setUsernameValidationErrorMessage(res.MINOR_INPUT_CREATE_ACCOUNT_MODAL_USERNAME_VALIDATION_ERROR_MSG_1);
    } else {
      setIsUsernameValidationError(false);
      setUsernameValidationErrorMessage('');
    }
    if (username?.length < 3) {
      errorPresent = true;
      setIsUsernameValidationError(true);
      setUsernameValidationErrorMessage(res.MINOR_INPUT_CREATE_ACCOUNT_MODAL_USERNAME_VALIDATION_ERROR_MSG_2);
    } else {
      setIsUsernameValidationError(false);
      setUsernameValidationErrorMessage('');
    }
    if (!password) {
      errorPresent = true;
      setIsPasswordValidationError(true);
      setPasswordValidationErrorMessage(res.MINOR_INPUT_CREATE_ACCOUNT_MODAL_PASSWORD_VALIDATION_ERROR_MSG_1);
    } else {
      setIsPasswordValidationError(false);
      setPasswordValidationErrorMessage('');
    }
    if (password?.length < 8) {
      errorPresent = true;
      setIsPasswordValidationError(true);
      setPasswordValidationErrorMessage(res.MINOR_INPUT_CREATE_ACCOUNT_MODAL_PASSWORD_VALIDATION_ERROR_MSG_2);
    } else {
      setIsPasswordValidationError(false);
      setPasswordValidationErrorMessage('');
    }
    if (!regExEmail.test(email)) {
      errorPresent = true;
      setIsEmailValidationError(true);
      setEmailValidationErrorMessage(res.MINOR_INPUT_CREATE_ACCOUNT_MODAL_EMAIL_VALIDATION_ERROR_MSG_1);
    } else {
      setIsEmailValidationError(false);
      setEmailValidationErrorMessage('');
    }
    if (errorPresent) {
      // Errors present => return
      return;
    } else {
      // Errors missing => save to db
      persistUserCredentialsAndSettings();
    }
  };

  const inputChangeListener = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    switch (e.target.id) {
      case 'create_username':
        setUsername(e.target.value.trim());
        break;
      case 'create_password':
        setPassword(e.target.value.trim());
        break;
      case 'create_email':
        setEmail(e.target.value.trim());
        break;
    }
  };

  return (
    <>
      <Button onClick={handleOpen} fullWidth color="secondary" variant="outlined" sx={{ mb: 2 }}>
        {res.CREATE_ACCOUNT}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* USERNAME */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel color="secondary" htmlFor="create_username">
              {res.USERNAME}
            </InputLabel>
            <Input
              id="create_username"
              value={username}
              onChange={inputChangeListener}
              type="text"
              color="secondary"
              error={isUsernameValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{usernameValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* EMAIL */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel color="secondary" htmlFor="create_email">
              {res.EMAIL}
            </InputLabel>
            <Input
              id="create_email"
              value={email}
              onChange={inputChangeListener}
              type="text"
              color="secondary"
              error={isEmailValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{emailValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* PASSWORD */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel color="secondary" htmlFor="create_password">
              {res.PASSWORD}
            </InputLabel>
            <Input
              id="create_password"
              value={password}
              onChange={inputChangeListener}
              type="password"
              color="secondary"
              error={isPasswordValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{passwordValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* SPEICHERN */}
          <Button
            onClick={validateInput}
            sx={{
              borderRadius: 0,
              margin: '0 auto',
              ml: 1,
              mt: 2,
              border: '1px solid rgba(0,0,0,0.7)',
              width: '100%',
              boxShadow: '3px 3px 5px 2px rgba(64,64,64, 0.7)'
            }}
            variant="contained"
            color="secondary"
            endIcon={<FileDownloadDoneIcon />}
          >
            {res.SAVE}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
