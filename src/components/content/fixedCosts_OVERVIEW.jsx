import React, { useState, useEffect } from 'react';
import ContentCard from '../minor/ContentCard';
import Grid from '@mui/material/Unstable_Grid2';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import CellWifiOutlinedIcon from '@mui/icons-material/CellWifiOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import WaterDamageOutlinedIcon from '@mui/icons-material/WaterDamageOutlined';
import ContentChart_VerticalBar from '../minor/ContentChart_VerticalBar';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate, getAllFixedCosts } from '../../services/pgConnections';
import SelectDropdown from '../minor/SelectDropdown';

const iconProperties = {
  fontSize: 55,
  opacity: 0.5,
  boxShadow: 10,
  borderRadius:1,
}

function constructContentCardObject(header, amount, interval, details, icon, img) { // TODO img
  let turnus = interval === '1.00' ? res.INTERVAL_MONTHLY
    : interval === '3.00' ? res.INTERVAL_QUARTERLY
    : interval === '6.00' ? res.INTERVAL_HALFYEARLY
    : interval === '12.00' ? res.INTERVAL_YEARLY
    : `alle ${interval} Monate`
  const contentCardObj =
   {
    header: header.trim(),
    amount: `${Math.round(amount)}${res.CURRENCY_EURO}`,
    interval: turnus,
    details: details,
    img: img ? img : `https://source.unsplash.com/random/?money&${Math.floor(Math.random() * 100)}`,
    icon: icon
  }
  if (img === 'no-img') {
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
    color1: colors?.color1,
    }
    return contentChartObj
}

function getUniqueEffectiveDates(fixedCosts) {
  return Array.from(new Set(fixedCosts.map(e => e.effective_date)))
}

/**
 *
 * @param {*} fixedCosts all fixed costs within db
 * @returns contentChartObj constructed via helper method constructContentChartObject
 */
function extractChartData(fixedCosts) {
  // Sports and Health
  const overviewColors = {
    color1: '',
  }
  // No filtering of overall results required
  const overviewFiltered = fixedCosts.results
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

function extractAndCondenseFixedCosts(fixedCosts) {
  let monthlyTotalCost = constructContentCardObject(res.FIXED_COSTS_MONHTLY_COST, null, '1.00', null, null, 'https://source.unsplash.com/random/?bills')
  let rentAndUtilities = constructContentCardObject(res.FIXED_COSTS_RENT_UTILITIES, null, '1.00', null, null, 'no-img')
  let dslAndPhone = constructContentCardObject(res.FIXED_COSTS_DSL_PHONE, null, '1.00', null, null, 'no-img')
  let sportsAndHealth = constructContentCardObject(res.FIXED_COSTS_SPORTS_HEALTH, null, '1.00', null, null, 'no-img')
  let mediaAndEntertainment = constructContentCardObject(res.FIXED_COSTS_MEDIA_ENTERTAINMENT, null, '1.00', null, null, 'no-img')
  let insurance = constructContentCardObject(res.FIXED_COSTS_INSURANCE, null, '1.00', null, null, 'no-img')
  let studentLoans = constructContentCardObject(res.FIXED_COSTS_STUDENT_LOANS, null, '1.00', null, null, 'no-img')
  // Monthly Total Amount
  monthlyTotalCost.amount = Math.round(fixedCosts.results
    .map((row) => row.monthly_cost)
    .reduce((partialSum, a) => partialSum + parseFloat(a), 0));
  // Rent and Utilities
  let rentAndUtilitiesFiltered = fixedCosts.results
    .filter((row) => row.category === categories.LIVING_ESSENTIALS_KEY )
  rentAndUtilities.amount = Math.round(rentAndUtilitiesFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  rentAndUtilities.details = rentAndUtilitiesFiltered
    .map((row) => row.description.trim())
  // DSL & Telephone
  let dslAndPhoneFiltered = fixedCosts.results
    .filter((row) => row.category === categories.INTERNET_AND_PHONE_KEY )
  dslAndPhone.amount = Math.round(dslAndPhoneFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  dslAndPhone.details = dslAndPhoneFiltered
      .map((row) => row.description.trim())
  // Sports and Health
  let sportsAndHealthFiltered = fixedCosts.results
    .filter((row) => row.category === categories.SPORTS_FACILITIES_KEY || row.category === categories.SUPPLEMENTS_HEALTH_KEY ||
      row.category === categories.SUPPLEMENTS_PERFORMANCE_KEY ||  row.category === categories.PHYSIO_AND_HEALTH_COURSES_KEY)
  sportsAndHealth.amount = Math.round(sportsAndHealthFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  sportsAndHealth.details = sportsAndHealthFiltered
      .map((row) => row.description.trim())
  // Media and Entertainment
  let mediaAndEntertainmentFiltered = fixedCosts.results
    .filter((row) => row.category === categories.LEISURE_GAMING_KEY || row.category === categories.LEISURE_MUSIC_PODCASTS_KEY ||
      row.category === categories.LEISURE_TV_CINEMA_KEY)
  mediaAndEntertainment.amount = Math.round(mediaAndEntertainmentFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  mediaAndEntertainment.details = mediaAndEntertainmentFiltered
      .map((row) => row.description.trim())
  // Insurance
  let insuranceFiltered = fixedCosts.results
    .filter((row) => row.category === categories.INSURANCE_KEY)
  insurance.amount = Math.round(insuranceFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  insurance.details = insuranceFiltered
      .map((row) => row.description.trim())
  // Student Loans
  let studentLoansFiltered = fixedCosts.results
    .filter((row) => row.category === categories.STUDENT_LOANS_KEY)
  studentLoans.amount = Math.round(studentLoansFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  studentLoans.details = studentLoansFiltered
      .map((row) => row.description.trim())
  return {monthlyTotalCost, rentAndUtilities, dslAndPhone, sportsAndHealth, mediaAndEntertainment, insurance, studentLoans}
}

export default function FixedCosts_Overview( props ) {
  // Fixed Costs from DB
  const [fixedCosts, setFixedCosts] = useState([])
  const [monthlyTotalCost, setMonthlyTotalCost] = useState(null)
  const [rentAndUtilities, setRentAndUtilities] = useState(null)
  const [dslAndPhone, setDslAndPhone] = useState(null)
  const [sportsAndHealth, setSportsAndHealth] = useState(null)
  const [mediaAndEntertainment, setMediaAndEntertainment] = useState(null)
  const [insurance, setInsurance] = useState(null)
  const [studentLoans, setStudentLoans] = useState(null)

  const [allFixedCostsChart, setAllFixedCostsChart] = useState(null)// TODO
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState(null)
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState('')

  const handleSelect = (selected) => {
    setSelectedEffectiveDate(selected)
  }

  useEffect(() => {
    const getFixedCosts = async() => {
      // All fixed costs in the DB
      let fixedCosts = await getAllFixedCosts();
      let effectiveDateSelectItems = getUniqueEffectiveDates(fixedCosts.results)
      if (!selectedEffectiveDate) {
        // Initialize selection
        setSelectedEffectiveDate(effectiveDateSelectItems[0])
      }
      setEffectiveDateSelectItems(effectiveDateSelectItems)
      let allFixedCosts = extractChartData(fixedCosts)
      setAllFixedCostsChart(allFixedCosts.overview)

      let results = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
        ? selectedEffectiveDate.substring(0,10) // Spezifische Kosten via ausgewähltem effective date
        : effectiveDateSelectItems
        ? effectiveDateSelectItems[0].substring(0,10) // Spezifische Kosten via erstem Eintrag aus allen effective dates
        : '2023-08-01'); // Fallback auf übergebenes Datum
      setFixedCosts(results)
      let extractedFixedCosts = extractAndCondenseFixedCosts(results)
      setMonthlyTotalCost(extractedFixedCosts.monthlyTotalCost)
      setRentAndUtilities(extractedFixedCosts.rentAndUtilities)
      setDslAndPhone(extractedFixedCosts.dslAndPhone)
      setSportsAndHealth(extractedFixedCosts.sportsAndHealth)
      setMediaAndEntertainment(extractedFixedCosts.mediaAndEntertainment)
      setInsurance(extractedFixedCosts.insurance)
      setStudentLoans(extractedFixedCosts.studentLoans)
     }
     getFixedCosts();
     }, [selectedEffectiveDate]
  )

  return (
    <Grid container spacing={3}>
      <Grid  sm={12} >
        <SelectDropdown
          selectLabel={res.DATE}
          selectItems={effectiveDateSelectItems}
          selectedValue={selectedEffectiveDate}
          handleSelect={handleSelect}
        />
      </Grid>
      <Grid xs={12}>
        <ContentCard elevation={12} {...monthlyTotalCost} imgHeight={250} />
      </Grid>
      <Grid xs={6} md={4} xl={2}>
        <ContentCard {...rentAndUtilities}  />
      </Grid>
      <Grid xs={6} md={4} xl={2}>
        <ContentCard {...studentLoans}  />
      </Grid>
      <Grid xs={6} md={4} xl={2}>
        <ContentCard {...dslAndPhone}  />
      </Grid>
      <Grid xs={6} md={4} xl={2}>
        <ContentCard {...sportsAndHealth}  />
      </Grid>
      <Grid xs={6} md={4} xl={2}>
        <ContentCard {...mediaAndEntertainment}  />
      </Grid>
      <Grid xs={6} md={4} xl={2}>
        <ContentCard {...insurance}  />
      </Grid>
      <Grid md={12} xl={8} display="flex" alignItems="center" justifyContent="center" >
        <ContentChart_VerticalBar {...allFixedCostsChart} barCount={1} selectedLabel={selectedEffectiveDate}/>
      </Grid>
    </Grid>
  )
}