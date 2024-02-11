import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ContentCardCosts from '../minor/ContentCardCosts';
import Grid from '@mui/material/Unstable_Grid2';
import ContentLineChart from '../minor/ContentChart_Line';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate, getAllFixedCosts } from '../../services/pgConnections';
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

function getUniqueEffectiveDates(fixedCosts) {
  return Array.from(new Set(fixedCosts.map(e => e.effective_date))).sort((a,b) => a<b) // SORT Desc to initialize with current value at index 0
}

/**
 *
 * @param {*} allFixedCosts all fixed costs within db
 * @returns contentChartObj constructed via helper method constructContentChartObject
 */
function extractChartData(allFixedCosts) {
  const overviewColors = {
    pointColor1: 'rgba(220, 193, 111,0.6)',
    lineColor1: 'black',
    selectionColor: 'rgba(255, 77, 77,0.8)',
  }
  // No filtering of overall results required
  const overviewFiltered = allFixedCosts.results
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
      .map((row) => row.monthly_cost)
      .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
    )
  } )

  const overviewDataSets = {
    dataSet1: overviewDataset,
    dataSet1Name: res.FIXED_COSTS_MONHTLY_COST,
  }
  let overview = constructContentChartObject(res.FIXED_COSTS_MONHTLY_COST, overviewXaxis, overviewDataSets, overviewColors)

  return { overview }
}

/**
 *  Extracts information of specific fixed costs valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedCosts
 * @returns
 */
function extractCardData(specificFixedCosts) {
  let monthlyTotalCost = constructContentCardObject(res.FIXED_COSTS_MONHTLY_COST, null, '1.00', null, null, res.NO_IMG)
  let rentAndUtilities = constructContentCardObject(res.FIXED_COSTS_RENT_UTILITIES, null, '1.00', null, null, res.NO_IMG)
  let dslAndPhone = constructContentCardObject(res.FIXED_COSTS_DSL_PHONE, null, '1.00', null, null, res.NO_IMG)
  let sportsAndHealth = constructContentCardObject(res.FIXED_COSTS_SPORTS_HEALTH, null, '1.00', null, null, res.NO_IMG)
  let mediaAndEntertainment = constructContentCardObject(res.FIXED_COSTS_MEDIA_ENTERTAINMENT, null, '1.00', null, null, res.NO_IMG)
  let insurance = constructContentCardObject(res.FIXED_COSTS_INSURANCE, null, '1.00', null, null, res.NO_IMG)
  let studentLoans = constructContentCardObject(res.FIXED_COSTS_STUDENT_LOANS, null, '1.00', null, null, res.NO_IMG)
  // Monthly Total Amount
  monthlyTotalCost.amount = Math.round(specificFixedCosts.results
    .map((row) => row.monthly_cost)
    .reduce((partialSum, a) => partialSum + parseFloat(a), 0));
  // Rent and Utilities
  let rentAndUtilitiesFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.LIVING_ESSENTIALS_KEY )
  rentAndUtilities.amount = Math.round(rentAndUtilitiesFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  rentAndUtilities.details = rentAndUtilitiesFiltered
    .map((row) => row.description.trim())
  // DSL & Telephone
  let dslAndPhoneFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.INTERNET_AND_PHONE_KEY )
  dslAndPhone.amount = Math.round(dslAndPhoneFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  dslAndPhone.details = dslAndPhoneFiltered
      .map((row) => row.description.trim())
  // Sports and Health
  let sportsAndHealthFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.SPORTS_FACILITIES_KEY || row.category === categories.SUPPLEMENTS_HEALTH_KEY ||
      row.category === categories.SUPPLEMENTS_PERFORMANCE_KEY ||  row.category === categories.PHYSIO_AND_HEALTH_COURSES_KEY)
  sportsAndHealth.amount = Math.round(sportsAndHealthFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  sportsAndHealth.details = sportsAndHealthFiltered
      .map((row) => row.description.trim())
  // Media and Entertainment
  let mediaAndEntertainmentFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.LEISURE_GAMING_KEY || row.category === categories.LEISURE_MUSIC_PODCASTS_KEY ||
      row.category === categories.LEISURE_TV_CINEMA_KEY)
  mediaAndEntertainment.amount = Math.round(mediaAndEntertainmentFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  mediaAndEntertainment.details = mediaAndEntertainmentFiltered
      .map((row) => row.description.trim())
  // Insurance
  let insuranceFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.INSURANCE_KEY)
  insurance.amount = Math.round(insuranceFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  insurance.details = insuranceFiltered
      .map((row) => row.description.trim())
  // Student Loans
  let studentLoansFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.STUDENT_LOANS_KEY)
  studentLoans.amount = Math.round(studentLoansFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  studentLoans.details = studentLoansFiltered
      .map((row) => row.description.trim())
  return {monthlyTotalCost, rentAndUtilities, dslAndPhone, sportsAndHealth, mediaAndEntertainment, insurance, studentLoans}
}

export default function FixedCosts_Overview( props ) {
  const { palette } = useTheme();
  // Selected Specific Fixed Costs
  const [monthlyTotalCostCard, setMonthlyTotalCostCard] = useState(null)
  const [rentAndUtilitiesCard, setRentAndUtilitiesCard] = useState(null)
  const [dslAndPhoneCard, setDslAndPhoneCard] = useState(null)
  const [sportsAndHealthCard, setSportsAndHealthCard] = useState(null)
  const [mediaAndEntertainmentCard, setMediaAndEntertainmentCard] = useState(null)
  const [insuranceCard, setInsuranceCard] = useState(null)
  const [studentLoansCard, setStudentLoansCard] = useState(null)
  // All Fixed Costs Visualized in Barchart
  const [allFixedCostsChart, setAllFixedCostsChart] = useState(null)
  // Effective Dates
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState(null)
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState('')
  const handleSelect = (selected) => {
    setSelectedEffectiveDate(selected)
  }

  useEffect(() => {
    const queryAllFixedCosts = async() => {
      // All fixed costs in the DB
      let allFixedCosts = await getAllFixedCosts();
      let effectiveDateSelectItems = getUniqueEffectiveDates(allFixedCosts.results)
      setSelectedEffectiveDate(effectiveDateSelectItems[0])
      setEffectiveDateSelectItems(effectiveDateSelectItems)
      let allFixedCostsChartData = extractChartData(allFixedCosts)
      setAllFixedCostsChart(allFixedCostsChartData.overview)
     }
      queryAllFixedCosts();
     }, []
  )

  useEffect(() => {
    const getSpecificFixedCosts = async() => {
      let specificFixedCosts = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
        ? selectedEffectiveDate.substring(0,10) // Spezifische Kosten via ausgewähltem effective date
        : effectiveDateSelectItems
        ? effectiveDateSelectItems[0].substring(0,10) // Spezifische Kosten via erstem Eintrag aus allen effective dates
        : res.FALLBACK_DATE); // Fallback auf übergebenes Datum
      let extractedFixedCosts = extractCardData(specificFixedCosts)
      setMonthlyTotalCostCard(extractedFixedCosts.monthlyTotalCost)
      setRentAndUtilitiesCard(extractedFixedCosts.rentAndUtilities)
      setDslAndPhoneCard(extractedFixedCosts.dslAndPhone)
      setSportsAndHealthCard(extractedFixedCosts.sportsAndHealth)
      setMediaAndEntertainmentCard(extractedFixedCosts.mediaAndEntertainment)
      setInsuranceCard(extractedFixedCosts.insurance)
      setStudentLoansCard(extractedFixedCosts.studentLoans)
     }
     // Prevents unnecessary initial Fallback query on pageload before queryAllFixedCosts has set the selectedEffectiveDate state
     if (selectedEffectiveDate) {
       getSpecificFixedCosts();
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
        <Grid xs={12}>
          <ContentCardCosts elevation={12} {...monthlyTotalCostCard} />
        </Grid>
        <Grid xs={6} md={4} xl={2}>
          <ContentCardCosts {...rentAndUtilitiesCard}  />
        </Grid>
        <Grid xs={6} md={4} xl={2}>
          <ContentCardCosts {...studentLoansCard}  />
        </Grid>
        <Grid xs={6} md={4} xl={2}>
          <ContentCardCosts {...dslAndPhoneCard}  />
        </Grid>
        <Grid xs={6} md={4} xl={2}>
          <ContentCardCosts {...sportsAndHealthCard}  />
        </Grid>
        <Grid xs={6} md={4} xl={2}>
          <ContentCardCosts {...mediaAndEntertainmentCard}  />
        </Grid>
        <Grid xs={6} md={4} xl={2}>
          <ContentCardCosts {...insuranceCard}  />
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
            <ContentLineChart {...allFixedCostsChart} dataSetCount={1} selectedLabel={selectedEffectiveDate}/>
          </Paper>
        </Grid>
        <Grid xs={0} xl={1}></Grid>
      </Grid>
    </>
  )
}