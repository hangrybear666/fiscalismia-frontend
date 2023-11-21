import React, { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TempDeleteTable from '../minor/TempDeleteTable';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import pgConnections from '../../services/pgConnections';
import ContentCardCosts from '../minor/ContentCardCosts';
import { getFabUtilityClass } from '@mui/material';
import { localStorageKeys } from '../../resources/resource_properties';
import InputFixedCostsFromTsvModal from '../minor/InputFixedCostsFromTsvModal';
import InputAllFoodItemsFromTsvModal from '../minor/InputAllFoodItemsFromTsvModal';


export default function PaletteAndThemeTest({ show = false }) {

  const userColorMode = window.localStorage.getItem(localStorageKeys.selectedMode)
  const userPalette = window.localStorage.getItem(localStorageKeys.selectedPalette)

  const click = () => {
    console.log("click")
    console.log(userColorMode)
    console.log(userPalette)

  }
  if (!show) {
    return (
    <>
    </>
    )
  }
  return (
    <Paper elevation={12}>

      <Stack direction="row" spacing={1}>
        <Button onClick={click} size="large" variant="contained" color="primary">Primary</Button>
        <Button size="large" variant="contained" color="secondary">Secondary</Button>
        <Button size="large" variant="contained" color="info">Info</Button>
        <Button size="large" variant="contained" color="success">Success</Button>
        <Button size="large" variant="contained" color="warning">Warning</Button>
        <Button size="large" variant="contained" color="error">Error</Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{mt:1}}>
        <Button size="large" variant="outlined" color="primary">Primary</Button>
        <Button size="large" variant="outlined" color="secondary">Secondary</Button>
        <Button size="large" variant="outlined" color="info">Info</Button>
        <Button size="large" variant="outlined" color="success">Success</Button>
        <Button size="large" variant="outlined" color="warning">Warning</Button>
        <Button size="large" variant="outlined" color="error">Error</Button>
      </Stack>

      <Stack direction="row" spacing={4} sx={{mt:1}}>
        <Button size="large" variant="text" color="primary">Primary</Button>
        <Button size="large" variant="text" color="secondary">Secondary</Button>
        <Button size="large" variant="text" color="info">Info</Button>
        <Button size="large" variant="text" color="success">Success</Button>
        <Button size="large" variant="text" color="warning">Warning</Button>
        <Button size="large" variant="text" color="error">Error</Button>
      </Stack>

      <Stack direction="row" sx={{ width: '100%',mt:1 }} spacing={0}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          This is an error alert
        </Alert>
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          This is a warning alert
        </Alert>
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          This is an info alert
        </Alert>
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          This is a success alert
        </Alert>
      </Stack>

      <Stack direction="row" sx={{ width: '100%',mt:1 }} spacing={0}>
        <Alert severity="error" variant="filled">
          <AlertTitle>Error</AlertTitle>
          This is an error alert
        </Alert>
        <Alert severity="warning"variant="filled">
          <AlertTitle>Warning</AlertTitle>
          This is a warning alert
        </Alert>
        <Alert severity="info"variant="filled">
          <AlertTitle>Info</AlertTitle>
          This is an info alert
        </Alert>
        <Alert severity="success"variant="filled">
          <AlertTitle>Success</AlertTitle>
          This is a success alert
        </Alert>
      </Stack>

      <Stack direction="row" sx={{ width: '100%',mt:1 }} spacing={0}>
        <Alert severity="error" variant="outlined">
          <AlertTitle>Error</AlertTitle>
          This is an error alert
        </Alert>
        <Alert severity="warning"variant="outlined">
          <AlertTitle>Warning</AlertTitle>
          This is a warning alert
        </Alert>
        <Alert severity="info"variant="outlined">
          <AlertTitle>Info</AlertTitle>
          This is an info alert
        </Alert>
        <Alert severity="success"variant="outlined">
          <AlertTitle>Success</AlertTitle>
          This is a success alert
        </Alert>
      </Stack>


      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h1" gutterBottom>
          h1. Heading
        </Typography>
        <Typography variant="h2" gutterBottom>
          h2. Heading
        </Typography>
        <Typography variant="h3" gutterBottom>
          h3. Heading
        </Typography>
        <Typography variant="h4" gutterBottom>
          h4. Heading
        </Typography>
        <Typography variant="h5" gutterBottom>
          h5. Heading
        </Typography>
        <Typography variant="h6" gutterBottom>
          h6. Heading
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
          neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
          quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
          neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
          quasi quidem quibusdam.
        </Typography>
        <Typography variant="button" display="block" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          caption text
        </Typography>
        <Typography variant="overline" display="block" gutterBottom>
          overline text
        </Typography>
      </Box>
    </Paper>
  );
}