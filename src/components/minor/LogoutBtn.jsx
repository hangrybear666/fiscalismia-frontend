
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
export default function LooutBtn() {
  return (
    <IconButton color="inherit" sx={{ p: 0.5 }}>
      <Avatar sx={{ m: 0, p:3, bgcolor: 'error.main' }}>
        <LogoutIcon />
      </Avatar>
    </IconButton>
  )
}