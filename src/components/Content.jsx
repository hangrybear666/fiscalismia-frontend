import React, { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TempDeleteTable from './minor/TempDeleteTable';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import pgConnections from '../services/pgConnections';

const postTest = (e) => {
  e.preventDefault();
  console.log("clicked POST")
  const response = pgConnections.getTest()
  console.log("response:")
  console.log(response)
}

export default function Content() {
  const [result, setResult] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [postInput, setPostInput] = useState('')
  const [putId, setPutId] = useState('')
  const [putInput, setPutInput] = useState('')
  const [deleteInput, setDeleteInput] = useState('')

  const inputChangeListener = (e) => {
    switch (e.target.id) {
      case "postInput":
        setPostInput(e.target.value)
        break;
      case "putInput":
        setPutInput(e.target.value)
        break;
      case "putId":
        setPutId(e.target.value)
        break;
      case "deleteInput":
        setDeleteInput(e.target.value)
        break;
    }
  }

  const getTest = async () => {
    const response = await pgConnections.getTest()
    setResult(response)
    setShowResult(true)
  }

  const processPost = async (e) => {
    e.preventDefault();
    if (postInput === '') {
      alert(`please provide a value for POST`)
    }
    const newEntry = {name: postInput}
    await pgConnections.postTest(newEntry)
    const response = await pgConnections.getTest()
    setResult(response)
    setPostInput('')
  }

  const processPut = async (e) => {
    e.preventDefault();
    if (putInput === '' || putId === '') {
      alert(`please provide values for PUT`)
    }
    const updatedEntry = {id: putId, name: putInput}
    await pgConnections.putTest(updatedEntry)
    const response = await pgConnections.getTest()
    setResult(response)
    setPutId('')
    setPutInput('')
  }

  const processDelete = async (e) => {
    e.preventDefault();
    if (deleteInput === '') {
      alert(`please provide a value for DELETE`)
    }
    console.log("deleting entry with ID:")
    console.log(deleteInput)
    await pgConnections.deleteTest(deleteInput)
    const response = await pgConnections.getTest()
    console.log(response)
    setResult(response)
    setDeleteInput('')
  }

  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }} className="selectionAnimation">
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon color="inherit" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by email address, phone number, or user UID"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{ mr: 1 }}>
                Add user
              </Button>
              <Tooltip title="Reload">
                <IconButton>
                  <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* DB REST TESTING */}
      <Grid sx={{ mt:2 }} container spacing={0} columns={{ xs: 6 }} direction="column" alignItems="center">
        <Grid item xs={6}>
          <Grid container spacing={2} direction="column" alignItems="left">
            <Grid item xs={12}>
              <Button  sx={{ width: 1}} variant="contained" size="large" color="primary" onClick={getTest}>GET</Button>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={processPost}>
                <FormControl sx={{ width: 1}}>
                  <InputLabel htmlFor="postInput">String for INSERT</InputLabel>
                  <FilledInput id="postInput" value={postInput} onChange={inputChangeListener}/>
                  <Button type="submit" variant="contained" size="large" color="info">POST</Button>
                </FormControl>
              </form>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={processPut}>
                <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                  <FormControl sx={{ width: 2/10}}>
                    <InputLabel htmlFor="putId">ID</InputLabel>
                    <FilledInput id="putId" type="number" size="small" inputProps={{ min: 0, max: 999 }} value={putId} onChange={inputChangeListener}/>
                  </FormControl>
                  <FormControl sx={{ width: 5/10}}>
                    <InputLabel htmlFor="putInput">String for UPDATE</InputLabel>
                    <FilledInput id="putInput" size="small" value={putInput} onChange={inputChangeListener}/>
                  </FormControl>
                  <Button sx={{ width: 3/10}} type="submit" variant="contained" size="large" color="success">PUT</Button>
                </Box>
              </form>
            </Grid>
            <Grid item xs={12} >
              <form onSubmit={processDelete}>
                <FormControl sx={{ width: 1}}>
                  <InputLabel htmlFor="deleteInput">ID for DELETE</InputLabel>
                  <FilledInput id="deleteInput" type="number" size="small" inputProps={{ min: 0, max: 999 }} value={deleteInput} onChange={inputChangeListener}/>
                  <Button type="submit" variant="contained" size="large" color="error">DELETE</Button>
                </FormControl>
              </form>
            </Grid>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="horizontal" />
            <Grid item xs={12}>
              <TempDeleteTable show={showResult} results={result.results}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="horizontal" />
      {/* DB REST TESTING */}
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
        No users for this project yet
      </Typography>
    </Paper>
  );
}