import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutBtn from './minor/LogoutBtn';
import { menuEntries } from './minor/MenuEntries';
import { resourceProperties as res } from '../resources/resource_properties'


const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &.Mui-selected:hover': {
    bgcolor: 'rgba(248,208,130,0.2)',
    color: 'rgba(248,204,116,0.9)',
  },
  '&.Mui-selected': {
    bgcolor: "rgba(255, 255, 255, 0.8)",
    color: "rgba(20,20,20,0.9)"
  }
}


export default function Navigator(props) {
  const { ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        {/* FISCALISMIA */}
        <ListItem sx={{ paddingY: 2, color: '#fff' }}>
          <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
          <ListItemText
            primary={res.APP_NAME}
            primaryTypographyProps={{
              textTransform: 'uppercase',
              letterSpacing: 4,
              fontSize: '22px !important',
              fontWeight: '300 !important'
            }}
          />
        </ListItem>
        <Divider sx={{ borderColor:'rgba(128,128,128,0.5)' }} />
        {/* HOME */}
        <ListItem  sx={{  padding:0 }}>
          <ListItemButton
            selected={true}
            sx={{ ...item }}>
            <ListItemText
              primary={res.HOME}
              primaryTypographyProps={{
                letterSpacing: 2,
                lineHeight: 2,
                fontSize: '16px !important',
                fontWeight: '400 !important',
                marginLeft:2
              }}/>
          </ListItemButton>
        </ListItem>
        <Divider sx={{ borderColor:'rgba(128,128,128,0.5)' }} />
        {/* NAVBAR MENU */}
        {menuEntries.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#ffffff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton selected={active} sx={{...item}}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2, borderColor:'rgba(128,128,128,0.5)' }} />
          </Box>
        ))}
        <ListItem sx={{
          color: 'rgba(245,81,81,0.8)',
          padding: 0,
          '&:hover': {
            bgcolor: 'rgba(245,81,81,0.3)',
            }
          }}>
          <LogoutBtn fullWidth={true}/>
        </ListItem>
      </List>
    </Drawer>
  );
}