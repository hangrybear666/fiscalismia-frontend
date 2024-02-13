import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TempDeleteTable from '../minor/TempDeleteTable';
import FilledInput from '@mui/material/FilledInput';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import pgConnections from '../../services/pgConnections';
import { localStorageKeys } from '../../resources/resource_properties';
import InputTsvForDbInsertionModal from '../minor/Modal_InputTsvForDbInsertion';
import { resourceProperties as res } from '../../resources/resource_properties';
import {
  postVariableExpensesTsv,
  postAllFoodItemTsv,
  postFixedIncomeTsv,
  postFixedCostTsv,
  postInvestmentsTsv } from '../../services/pgConnections';

export default function Content({ show = true, value }) {
  const [result, setResult] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [postInput, setPostInput] = useState('')
  const [putId, setPutId] = useState('')
  const [putInput, setPutInput] = useState('')
  const [deleteInput, setDeleteInput] = useState('')

  const inputChangeListener = (e) => {
    e.preventDefault();
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

  const getFixedCostsByEffectiveDate = async () => {
    const response = await pgConnections.getFixedCostsByEffectiveDate('01.08.2023')
    console.log(response)
    setResult(response)
    setShowResult(true)
  }

  const processPost = async (e) => {
    e.preventDefault();
    if (postInput === '') {
      alert(`please provide a value for POST`)
    }
    const newEntry = {description: postInput}
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
    const updatedEntry = {description: putInput}
    await pgConnections.putTest(putId, updatedEntry)
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
  if (!show) {
    return (
    <>
    </>
    )
  }
  return (
    <Paper elevation={12} sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }} className="selectionAnimation">
      <Typography color="inherit" variant="h5">
        {value.header}
      </Typography>
      <Typography color="inherit" variant="h6">
        {value.subHeader}
      </Typography>
      <Typography color="inherit" variant="body1">
        {value.path}
      </Typography>
      {window.localStorage.getItem(localStorageKeys.loginUserName) == 'admin'
      ? <Box >
          <InputTsvForDbInsertionModal
            id={"fixed_costs"}
            postMethod={postFixedCostTsv}
            btnString={res.MINOR_INPUT_FIXED_COSTS_MODAL_OPEN}
            description={res.MINOR_INPUT_FIXED_COSTS_MODAL_INPUT_TEXT_AREA_DESCRIPTION}
            helperText={res.MINOR_INPUT_FIXED_COSTS_MODAL_INPUT_TEXT_AREA_HELPER}
          />
        </Box>
      : null}
      {window.localStorage.getItem(localStorageKeys.loginUserName) == 'admin'
      ? <Box >
          <InputTsvForDbInsertionModal
            id={"food_items"}
            postMethod={postAllFoodItemTsv}
            btnString={res.MINOR_INPUT_ALL_FOOD_ITEMS_MODAL_OPEN}
            description={res.MINOR_INPUT_ALL_FOOD_ITEMS_MODAL_INPUT_TEXT_AREA_DESCRIPTION}
            helperText={res.MINOR_INPUT_ALL_FOOD_ITEMS_MODAL_INPUT_TEXT_AREA_HELPER}
          />
        </Box>
      : null}
      {window.localStorage.getItem(localStorageKeys.loginUserName) == 'admin'
      ? <Box>
          <InputTsvForDbInsertionModal
            id={"fixed_income"}
            postMethod={postFixedIncomeTsv}
            btnString={res.MINOR_INPUT_FIXED_INCOME_MODAL_OPEN}
            description={res.MINOR_INPUT_FIXED_INCOME_MODAL_INPUT_TEXT_AREA_DESCRIPTION}
            helperText={res.MINOR_INPUT_FIXED_INCOME_MODAL_INPUT_TEXT_AREA_HELPER}
          />
        </Box>
      : null}
      {window.localStorage.getItem(localStorageKeys.loginUserName) == 'admin'
      ? <Box>
          <InputTsvForDbInsertionModal
            id={"variable_expenses"}
            postMethod={postVariableExpensesTsv}
            btnString={res.MINOR_INPUT_VARIABLE_EXPENSES_MODAL_OPEN}
            description={res.MINOR_INPUT_VARIABLE_EXPENSES_MODAL_INPUT_TEXT_AREA_DESCRIPTION}
            helperText={res.MINOR_INPUT_VARIABLE_EXPENSES_MODAL_INPUT_TEXT_AREA_HELPER}
          />
        </Box>
      : null}
      {window.localStorage.getItem(localStorageKeys.loginUserName) == 'admin'
      ? <Box sx={{mb:2}}>
          <InputTsvForDbInsertionModal
            id={"investments"}
            postMethod={postInvestmentsTsv}
            btnString={res.MINOR_INPUT_INVESTMENTS_MODAL_OPEN}
            description={res.MINOR_INPUT_INVESTMENTS_MODAL_INPUT_TEXT_AREA_DESCRIPTION}
            helperText={res.MINOR_INPUT_INVESTMENTS_MODAL_INPUT_TEXT_AREA_HELPER}
          />
        </Box>
      : null}

      {/* DB REST TESTING */}
      <Grid sx={{ mt:2, mb:3 }} container spacing={0} columns={{ xs: 6 }} direction="column" alignItems="center">
        <Grid xs={6}>
          <Typography color="inherit" variant="h5" align="center">
            Database Queries
          </Typography>
          <Divider sx={{ mb: 2, borderBottomWidth: '1px', borderBottomColor:'#333333'}} orientation="horizontal" role="presentation"/>
          <Grid container spacing={2} direction="column" alignItems="left">
            <Grid xs={12}>
              <Button  sx={{ width: 1}} variant="contained" size="large" color="secondary" onClick={getFixedCostsByEffectiveDate}>GET Fixed Costs</Button>
            </Grid>
            <Grid xs={12}>
              <Button  sx={{ width: 1}} variant="contained" size="large" color="primary" onClick={getTest}>GET Test Data</Button>
            </Grid>
            <Grid xs={12}>
              <Box component="form" noValidate onSubmit={processPost}>
                <FormControl sx={{ width: 1}}>
                  <InputLabel htmlFor="postInput">String for INSERT</InputLabel>
                  <FilledInput id="postInput" value={postInput} onChange={inputChangeListener}/>
                  <Button type="submit" variant="contained" size="large" color="info">POST Test Data</Button>
                </FormControl>
              </Box>
            </Grid>
            <Grid xs={12}>
              <Box component="form" noValidate
                onSubmit={processPut}
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
                <Button sx={{ width: 3/10}} type="submit" variant="contained" size="large" color="success">PUT Test Data</Button>
              </Box>
            </Grid>
            <Grid xs={12} sx={{ mb:4 }}>
              <Box component="form" noValidate onSubmit={processDelete}>
                <FormControl sx={{ width: 1}}>
                  <InputLabel htmlFor="deleteInput">ID for DELETE</InputLabel>
                  <FilledInput id="deleteInput" type="number" size="small" inputProps={{ min: 0, max: 999 }} value={deleteInput} onChange={inputChangeListener}/>
                  <Button type="submit" variant="contained" size="large" color="error">DELETE Test Data</Button>
                </FormControl>
              </Box>
            </Grid>
            <Grid xs={12}>
              <Typography color="inherit" variant="h5" align="center">
                Database Result
              </Typography>
              <Divider sx={{  mb:2, borderBottomWidth: '1px', borderBottomColor:'#333333'}} orientation="horizontal" role="presentation"/>
              <TempDeleteTable show={showResult} results={result.results}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* DB REST TESTING */}



    </Paper>
  );
}