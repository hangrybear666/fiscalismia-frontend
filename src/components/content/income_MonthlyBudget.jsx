import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ContentCardCosts from '../minor/ContentCardCosts';
import Grid from '@mui/material/Unstable_Grid2';
import ContentLineChart from '../minor/ContentChart_Line';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedIncomeByEffectiveDate, getAllFixedIncome, getAllFixedCosts, getFixedCostsByEffectiveDate } from '../../services/pgConnections';
import SelectDropdown from '../minor/SelectDropdown';
import { Paper } from '@mui/material';

function constructContentCardObject(header, amount, subtitle, details, icon, img) { // TODO img
  let turnus = subtitle === '1.00' ? res.INTERVAL_MONTHLY
    : subtitle === '3.00' ? res.INTERVAL_QUARTERLY
    : subtitle === '6.00' ? res.INTERVAL_HALFYEARLY
    : subtitle === '12.00' ? res.INTERVAL_YEARLY
    : `alle ${subtitle} Monate`
  const contentCardObj =
   {
    header: header.trim(),
    amount: `${Math.round(amount)}${res.CURRENCY_EURO}`,
    subtitle: turnus,
    details: details,
    img: img ? img : `https://source.unsplash.com/random/?money&${Math.floor(Math.random() * 100)}`,
    icon: icon
  }
  if (img === res.NO_IMG) {
    contentCardObj.img = null
  }
  return contentCardObj
}


function constructContentChartObject( title, xAxis, dataSets, colors ) {
  const contentChartObj =
    {
    chartTitle: title,
    labels: xAxis,
    dataSet1: dataSets?.dataSet1,
    dataSet1Name: dataSets?.dataSet1Name,
    dataSet1Order: dataSets?.dataSet1Order,
    pointColor1: colors?.pointColor1,
    lineColor1: colors?.lineColor1,

    dataSet2: dataSets?.dataSet2,
    dataSet2Name: dataSets?.dataSet2Name,
    dataSet2Order: dataSets?.dataSet2Order,
    pointColor2: colors?.pointColor2,
    lineColor2: colors?.lineColor2,
    selectionColor: colors?.selectionColor,
    }
    return contentChartObj
}

function getUniqueEffectiveDates(fixedIncome, fixedCosts) {
  const incomeSet = new Set(fixedIncome.map(e => e.effective_date))
  if (fixedCosts) {
    const costsSet = new Set(fixedCosts.map(e => e.effective_date))
    return Array.from(new Set([...incomeSet,...costsSet])).sort()
  }
  else {
    return Array.from(new Set(fixedIncome.map(e => e.effective_date)))
  }
}

/**
 *
 * @param {*} allFixedIncome all fixed income data within db
 * @param {*} allFixedCosts all fixed income data within db
 * @param {*} palette theme palette for colors
 * @returns contentChartObj constructed via helper method constructContentChartObject
 */
function extractChartData(allFixedIncome, allFixedCosts, palette) {
  const colors = {
    pointColor1: palette.success.main,
    lineColor1:  palette.success.dark,
    pointColor2: palette.error.light,
    lineColor2:  palette.error.dark,
    selectionColor: 'rgba(255, 77, 77,0.8)',
  }
  // Filter Income
  const incomeFiltered = allFixedIncome.results
    .filter(e => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
  // unique effective dates as string array
  const incomeDatesArr = getUniqueEffectiveDates(incomeFiltered)
  // only read date string from datetime
  let overviewDataset = []
  // for each unique date create an xAxis array with summed up monthly_cost values
  incomeDatesArr.forEach( (xAxisEntry) => {
    overviewDataset.push(
      {
        x: xAxisEntry.substring(0,10),
        y: incomeFiltered
            .filter(e => e.effective_date === xAxisEntry)
            .map((row) => Math.floor(row.value / row.monthly_interval))
            .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
      }
    )
  } )

  console.log(overviewDataset)

  // No Filtering of Costs
  const costsFiltered = allFixedCosts.results
  // unique effective dates as string array
  const costsDatesArr = getUniqueEffectiveDates(costsFiltered)
  let costsDataset = []
  // for each unique date create an xAxis array with summed up monthly_cost values
  costsDatesArr.forEach( (xAxisEntry) => {
    costsDataset.push(
      {
        x: xAxisEntry.substring(0,10),
        y: costsFiltered
            .filter(e => e.effective_date === xAxisEntry)
            .map((row) => row.monthly_cost)
            .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
      }
    )
  } )

  const incomeDataSets = {
    dataSet1: overviewDataset,
    dataSet1Name: res.INCOME_MONTHLY_NET_INCOME,
    dataSet1Order: 1, // Datasets with higher order are drawn first
    dataSet2: costsDataset,
    dataSet2Name: res.INCOME_MONTHLY_FIXED_COSTS,
    dataSet2Order: 0,
  }

  // 1 merge effective-date x-axis into single array
  // 2 create array from set to eliminate duplicates
  // 3 read date substring in the format yyyy-mm-dd // TODO
  const xAxisArray =
    Array.from(new Set(incomeDatesArr.concat(costsDatesArr)))
    .sort()
    .map(e => e.substring(0,10))

  let overview = constructContentChartObject(res.INCOME_MONTHLY_BUDGET_CHART_HEADER, xAxisArray, incomeDataSets, colors)

  return { overview }
}

/**
 *  Extracts information of specific fixed income valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedIncome
 * @returns
 */
function extractCardData(specificFixedIncome, specificFixedCosts) {
  let monthlyNetIncome = constructContentCardObject(res.INCOME_NET_INCOME, null, '1.00', null, null, res.NO_IMG)
  let oneTimeYearlyBonus = constructContentCardObject(res.INCOME_ONE_TIME_BONUS, null, '12.00', null, null, res.NO_IMG)
  let monthlyTotalCost = constructContentCardObject(res.INCOME_FIXED_COST_CARD_HEADER, null, '1.00', null, null, res.NO_IMG)
  // Monhtly Net Income
  let monthlyNetIncomeFiltered = specificFixedIncome.results
    .filter(e => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter(e => !e.description.toLowerCase().includes('bonus'))
  monthlyNetIncome.amount = Math.round(monthlyNetIncomeFiltered
    .map((row) => Math.floor(row.value / row.monthly_interval))
    .reduce((partialSum, a) => partialSum + parseFloat(a), 0));
  monthlyNetIncome.details = monthlyNetIncomeFiltered
    .map((row) => row.description.trim())
  // One Time Yearly Bonus
  let oneTimeYearlyBonusFiltered = specificFixedIncome.results
    .filter(e => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter(e => e.description.toLowerCase().includes('bonus'))
  oneTimeYearlyBonus.amount = Math.round(oneTimeYearlyBonusFiltered
    .map((row) => row.value)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  oneTimeYearlyBonus.details = oneTimeYearlyBonusFiltered
    .map((row) => row.description.trim())
  // Total Fixed Costs
  monthlyTotalCost.amount = Math.round(specificFixedCosts.results
    .map((row) => row.monthly_cost)
    .reduce((partialSum, a) => partialSum + parseFloat(a), 0));
  monthlyTotalCost.details
    = [res.LIVING_ESSENTIALS, res.RECREATION_RELAXATION]
  return {monthlyNetIncome, oneTimeYearlyBonus, monthlyTotalCost}
}

export default function Income_Monthly_Budget( props ) {
  const { palette } = useTheme();
  // Selected Specific Fixed Income
  const [monthlyTotalCostCard, setMonthlyTotalCostCard] = useState(null)
  const [monthlyNetIncomeCard, setMonthlyNetIncomeCard] = useState(null)
  const [oneTimeYearlyBonusCard, setOneTimeYearlyBonusCard] = useState(null)
  // Monthly Net income Visualized in Barchart
  const [monthlyNetIncomeChart, setMonthlyNetIncomeChart] = useState(null)
  // Effective Dates
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState(null)
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState('')
  const handleSelect = (selected) => {
    setSelectedEffectiveDate(selected)
  }

  useEffect(() => {
    const queryAllFixedIncomeData = async() => {
      // All income data in the DB
      let allFixedIncomeResponse = await getAllFixedIncome();
      let allFixedCostsResponse = await getAllFixedCosts();
      let effectiveDateSelectItems = getUniqueEffectiveDates(allFixedIncomeResponse.results, allFixedCostsResponse.results)
      setSelectedEffectiveDate(effectiveDateSelectItems[0])
      setEffectiveDateSelectItems(effectiveDateSelectItems)
      let allFixedIncomeChartData = extractChartData(allFixedIncomeResponse, allFixedCostsResponse, palette)
      setMonthlyNetIncomeChart(allFixedIncomeChartData.overview)
     }
      queryAllFixedIncomeData();
     }, []
  )

  useEffect(() => {
    const getSpecificFixedIncome = async() => {
      let specificFixedIncome = await getFixedIncomeByEffectiveDate(
        selectedEffectiveDate
        ? selectedEffectiveDate.substring(0,10) // Specific Income via selected effective date
        : effectiveDateSelectItems
        ? effectiveDateSelectItems[0].substring(0,10) // Specific Income via first entry in all effective dates
        : '2023-08-01'); // Fallback to provided date
      let specificFixedCost = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
        ? selectedEffectiveDate.substring(0,10) // Specific Income via selected effective date
        : effectiveDateSelectItems
        ? effectiveDateSelectItems[0].substring(0,10) // Specific Income via first entry in all effective dates
        : '2023-08-01'); // Fallback to provided date
      let extractedFixedIncome = extractCardData(specificFixedIncome, specificFixedCost)
      setMonthlyNetIncomeCard(extractedFixedIncome.monthlyNetIncome)
      setOneTimeYearlyBonusCard(extractedFixedIncome.oneTimeYearlyBonus)
      setMonthlyTotalCostCard(extractedFixedIncome.monthlyTotalCost)
     }
     // Prevents unnecessary initial Fallback query on pageload before queryAllFixedIncomeData has set the selectedEffectiveDate state
     if (selectedEffectiveDate) {
       getSpecificFixedIncome();
     }
     }, [selectedEffectiveDate]
  )

  return (
    <>
      <Grid container spacing={3} justifyContent="center" >
        <Grid  xs={0} xl={1.5} >
        </Grid>
        <Grid  xs={12} xl={9} >
          <SelectDropdown
            sx={{display:'flex-box'}}
            selectLabel={res.DATE}
            selectItems={effectiveDateSelectItems}
            selectedValue={selectedEffectiveDate}
            handleSelect={handleSelect}
          />
        </Grid>
        <Grid  xs={0} xl={1.5} >
        </Grid>
        <Grid  xs={0} xl={1.5} >
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ContentCardCosts {...monthlyNetIncomeCard}  />
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ContentCardCosts {...oneTimeYearlyBonusCard}  />
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ContentCardCosts {...monthlyTotalCostCard}  />
        </Grid>
        <Grid  xs={0} xl={1.5} >
        </Grid>
        <Grid xs={0} xl={1}></Grid>
        <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center" >
          <Paper
            elevation={6}
            sx={{
              borderRadius:0,
              border: `1px solid ${palette.border.dark}`,
              padding: 1,
              backgroundColor: palette.background.default,
              width: '90%',
              height: 500
            }}>
            <ContentLineChart {...monthlyNetIncomeChart} dataSetCount={2} selectedLabel={selectedEffectiveDate}/>
          </Paper>
        </Grid>
        <Grid xs={0} xl={1}></Grid>
      </Grid>
    </>
  )
}