import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutBtn from './minor/LogoutBtn';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuEntries } from './minor/MenuEntries';
import { resourceProperties as res } from '../resources/resource_properties'
import { paths } from '../resources/router_navigation_paths';


const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    bgcolor: 'rgba(248,208,130,0.3)',
    color: 'rgba(248,204,116,0.9)',
  },
  '&.Mui-selected:hover': {
    bgcolor: 'rgba(248,208,130,0.3)',
    color:'rgba(255, 255, 255, 0.7)',
  },
  '&.Mui-selected': {
    bgcolor: "rgba(255, 255, 255, 0.8)",
    color: "rgba(20,20,20,0.9)",
  }
}


export default function Navigator(props) {
  const [selectedRelativePath, setSelectedRelativePath] = useState('')
  const { ...other } = props;
  const navigate = useNavigate()
  let location = useLocation()

  const handleMenuSelection = (parentId, childId, path) => {
    const contentHeader = {
      header: parentId,
      subHeader: childId,
      path: path
    }
    props.setContentHeader(contentHeader)
    setSelectedRelativePath(path)
    navigate(path)
  }

  const isMenuEntrySelected = (path) => {
    const localLocation = location.pathname.split(`${paths.APP_ROOT_PATH}/`)
    return path === selectedRelativePath ? true : path === localLocation[1] ? true : false
  }

  const isHomeSelected = () => {
    if (location.pathname === paths.APP_ROOT_PATH) {
      props.setContentHeader('')
      return true
    } else {
      return false
    }
  }

  return (
    <Drawer variant="permanent" {...other} >
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
        <Divider/>
        {/* HOME */}
        <ListItem  sx={{  padding:0 }}>
          <ListItemButton
            selected={isHomeSelected()}
            sx={{ ...item }}
            onClick={() => {
              setSelectedRelativePath(null);
              navigate(paths.APP_ROOT_PATH);
            }}
            >
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
        <Divider/>
        {/* NAVBAR MENU */}
        {menuEntries.map(({ id: parentId, children }) => (
          <Box key={parentId} >
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#ffffff' }}>{parentId}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, path, icon}) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  selected={isMenuEntrySelected(path)}
                  sx={{...item}}
                  onClick={() => handleMenuSelection(parentId, childId, path)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        <ListItem sx={{
          color: 'rgba(245,81,81,0.9)',
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