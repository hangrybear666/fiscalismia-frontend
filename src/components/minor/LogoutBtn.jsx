
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { Navigate, useNavigate } from 'react-router-dom';

export default function LogoutBtn() {

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    console.log("Logging Out...")
    window.localStorage.removeItem('jwt-token')
    navigate('/login')
  };

  return (
    <Box component="form" noValidate onSubmit={handleLogout}>
      <IconButton type="submit" color="inherit" sx={{ p: 0.5 }}>
        <Avatar sx={{ m: 0, p:3, bgcolor: 'error.main' }}>
          <LogoutIcon />
        </Avatar>
      </IconButton>
    </Box>
  )
}