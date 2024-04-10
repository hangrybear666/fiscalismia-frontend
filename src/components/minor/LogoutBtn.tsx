import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { invalidateSession, useAuth } from '../../services/userAuthentication';
import { resourceProperties as res } from '../../resources/resource_properties';
import { paths } from '../../resources/router_navigation_paths';
import { AuthInfo } from '../../types/custom/customTypes';

export default function LogoutBtn({ fullWidth }: { fullWidth: boolean }) {
  const navigate = useNavigate();
  const { setToken, setLoginUserName } = useAuth() as unknown as AuthInfo; // TODO fix as unknown
  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log('Logging Out...');
    invalidateSession(setToken, setLoginUserName);
    navigate(paths.LOGIN);
  };

  if (fullWidth) {
    return (
      <Box sx={{ width: '100%' }} width={'100%'}>
        <ListItemButton onClick={handleLogout}>
          <LogoutIcon />
          <ListItemText
            primary={res.LOGOUT}
            primaryTypographyProps={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginLeft: 2
            }}
          />
        </ListItemButton>
      </Box>
    );
  }

  return (
    <IconButton onClick={handleLogout} color="inherit" sx={{ p: 0.5 }}>
      <Avatar variant="rounded" sx={{ m: 0, p: 2, bgcolor: 'error.main' }}>
        <LogoutIcon />
      </Avatar>
    </IconButton>
  );
}
