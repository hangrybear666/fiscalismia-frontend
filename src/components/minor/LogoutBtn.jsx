
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/userAuthentication';
import { resourceProperties as res } from '../../resources/resource_properties'

export default function LogoutBtn({ fullWidth }) {
  const { setToken, setLoginUserName,  setAuthenticated } = useAuth()
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    console.log("Logging Out...")
    window.localStorage.removeItem('jwt-token')
    window.localStorage.removeItem('loginUserName')
    setToken(null)
    setLoginUserName(null)
    setAuthenticated(false)
    navigate('/login')
  };

  if (fullWidth) {
    return (
      <Box sx={{width:'100%'}} width={'100%'}>
        <ListItemButton
          onClick={handleLogout} >
          <LogoutIcon />
          <ListItemText
            primary={res.LOGOUT}
            primaryTypographyProps={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginLeft: 2
            }}/>
        </ListItemButton>
      </Box>
    )
  }

  return (
    <Box component="form" noValidate onSubmit={handleLogout}>
      <IconButton type="submit" color="inherit" sx={{ p: 0.5 }}>
        <Avatar variant="rounded" sx={{ m: 0, p:2, bgcolor: 'error.main' }}>
          <LogoutIcon />
        </Avatar>
      </IconButton>
    </Box>
  )
}