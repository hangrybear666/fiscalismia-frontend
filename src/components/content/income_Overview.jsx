import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ContentCardCosts from '../minor/ContentCardCosts';
import Grid from '@mui/material/Unstable_Grid2';
import ContentLineChart from '../minor/ContentChart_Line';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedIncomeByEffectiveDate, getAllFixedIncome } from '../../services/pgConnections';
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
    pointColor1: colors.pointColor1,
    lineColor1: colors.lineColor1,
    selectionColor: colors.selectionColor,
    }
    return contentChartObj
}

function getUniqueEffectiveDates(fixedIncome) {
  return Array.from(new Set(fixedIncome.map(e => e.effective_date)))
}

/**
 *
 * @param {*} allFixedIncome all fixed income data within db
 * @returns contentChartObj constructed via helper method constructContentChartObject
 */
function extractChartData(allFixedIncome) {
  const overviewColors = {
    pointColor1: 'rgba(220, 193, 111,0.6)',
    lineColor1: 'black',
    selectionColor: 'rgba(255, 77, 77,0.8)',
  }
  // No filtering of overall results required
  const overviewFiltered = allFixedIncome.results
  // unique effective dates as string array
  const overviewDatesArr = getUniqueEffectiveDates(overviewFiltered)
  overviewDatesArr.sort()
  // only read date string from datetime
  const overviewXaxis = overviewDatesArr.map(e => e.substring(0,10))
  let overviewDataset = []
  // for each unique date create an xAxis array with summed up monthly_cost values
  overviewDatesArr.forEach( (xAxisEntry) => {
    overviewDataset.push(
      overviewFiltered
      .filter(e => e.effective_date === xAxisEntry)
      .filter(e => e.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY)
      .map((row) => Math.floor(row.value / row.monthly_interval) * 12)
      .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
    )
  } )

  const overviewDataSets = {
    dataSet1: overviewDataset,
    dataSet1Name: res.INCOME_YEARLY_GROSS_INCOME,
  }
  let overview = constructContentChartObject(res.INCOME_YEARLY_GROSS_INCOME, overviewXaxis, overviewDataSets, overviewColors)

  return { overview }
}

/**
 *  Extracts information of specific fixed income valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedIncome
 * @returns
 */
function extractCardData(specificFixedIncome) {
  let monthlyNetIncome = constructContentCardObject(res.INCOME_NET_INCOME, null, '1.00', null, null, res.NO_IMG)
  let monthlyGrossIncome = constructContentCardObject(res.INCOME_GROSS_INCOME, null, '1.00', null, null, res.NO_IMG)
  let yearlyGrossIncome = constructContentCardObject(res.INCOME_GROSS_INCOME, null, '12.00', null, null, res.NO_IMG)
  let oneTimeYearlyBonus = constructContentCardObject(res.INCOME_ONE_TIME_BONUS, null, '12.00', null, null, res.NO_IMG)
  // Monhtly Net Income
  let monthlyNetIncomeFiltered = specificFixedIncome.results
    .filter(e => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter(e => !e.description.toLowerCase().includes('bonus'))
  monthlyNetIncome.amount = Math.round(monthlyNetIncomeFiltered
    .map((row) => Math.floor(row.value / row.monthly_interval))
    .reduce((partialSum, a) => partialSum + parseFloat(a), 0));
  monthlyNetIncome.details = monthlyNetIncomeFiltered
    .map((row) => row.description.trim())
  // Monthly Gross Income
  let monthlyGrossIncomeFiltered = specificFixedIncome.results
    .filter(e => e.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY)
    .filter(e => !e.description.toLowerCase().includes('bonus'))
  monthlyGrossIncome.amount = Math.round(monthlyGrossIncomeFiltered
    .map((row) => Math.floor(row.value / row.monthly_interval))
    .reduce((partialSum, a) => partialSum + parseFloat(a), 0));
  monthlyGrossIncome.details = monthlyGrossIncomeFiltered
    .map((row) => row.description.trim())
  // Yearly Gross Income
  let yearlyGrossIncomeFiltered = specificFixedIncome.results
    .filter((row) => row.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY )
  yearlyGrossIncome.amount = Math.round(yearlyGrossIncomeFiltered
    .map((row) => Math.floor(row.value / row.monthly_interval) * 12)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  yearlyGrossIncome.details = yearlyGrossIncomeFiltered
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
  return {monthlyNetIncome, monthlyGrossIncome, yearlyGrossIncome, oneTimeYearlyBonus}
}

export default function Income_Overview( props ) {
  const { palette } = useTheme();
  // Selected Specific Fixed Income
  const [monthlyNetIncomeCard, setMonthlyNetIncomeCard] = useState(null)
  const [monthlyGrossIncomeCard, setMonthlyGrossIncomeCard] = useState(null)
  const [yearlyGrossIncomeCard, setYearlyGrossIncomeCard] = useState(null)
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
      let effectiveDateSelectItems = getUniqueEffectiveDates(allFixedIncomeResponse.results)
      setSelectedEffectiveDate(effectiveDateSelectItems[0])
      setEffectiveDateSelectItems(effectiveDateSelectItems)
      let allFixedIncomeChartData = extractChartData(allFixedIncomeResponse)
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
        : res.FALLBACK_DATE); // Fallback to provided date
      let extractedFixedIncome = extractCardData(specificFixedIncome)
      setMonthlyNetIncomeCard(extractedFixedIncome.monthlyNetIncome)
      setMonthlyGrossIncomeCard(extractedFixedIncome.monthlyGrossIncome)
      setYearlyGrossIncomeCard(extractedFixedIncome.yearlyGrossIncome)
      setOneTimeYearlyBonusCard(extractedFixedIncome.oneTimeYearlyBonus)
     }
     // Prevents unnecessary initial Fallback query on pageload before queryAllFixedIncomeData has set the selectedEffectiveDate state
     if (selectedEffectiveDate) {
       getSpecificFixedIncome();
     }
     }, [selectedEffectiveDate]
  )

  return (
    <>
      <Grid container spacing={3}>
        <Grid  xs={12} >
          <SelectDropdown
            selectLabel={res.DATE}
            selectItems={effectiveDateSelectItems}
            selectedValue={selectedEffectiveDate}
            handleSelect={handleSelect}
          />
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ContentCardCosts {...monthlyNetIncomeCard}  />
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ContentCardCosts {...oneTimeYearlyBonusCard}  />
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ContentCardCosts {...monthlyGrossIncomeCard}  />
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ContentCardCosts {...yearlyGrossIncomeCard}  />
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
            <ContentLineChart {...monthlyNetIncomeChart} dataSetCount={1} selectedLabel={selectedEffectiveDate}/>
          </Paper>
        </Grid>
        <Grid xs={0} xl={1}></Grid>
      </Grid>
    </>
  )
}