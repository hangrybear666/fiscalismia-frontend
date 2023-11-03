import React, { useState, useEffect } from 'react';
import ContentCardCosts from '../minor/ContentCardCosts';
import Grid from '@mui/material/Unstable_Grid2';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import CellWifiOutlinedIcon from '@mui/icons-material/CellWifiOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import WaterDamageOutlinedIcon from '@mui/icons-material/WaterDamageOutlined';
import SelectDropdown from '../minor/SelectDropdown';
import ContentVerticalBarChart from '../minor/ContentChart_VerticalBar';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate, getAllFixedCosts } from '../../services/pgConnections';

const iconProperties = {
  fontSize: 55,
  opacity: 0.5,
  boxShadow: 10,
  borderRadius:1,
}

function constructContentCardObject(header, amount, subtitle, details, icon, img) {
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
  if (img === 'no-img') {
    contentCardObj.img = null
  }
  return contentCardObj
}

function filterLivingEssentials(specificFixedCosts) {
  return specificFixedCosts.results
    .filter((row) => row.category === categories.LIVING_ESSENTIALS_KEY || row.category === categories.STUDENT_LOANS_KEY ||
    row.category === categories.INTERNET_AND_PHONE_KEY ||  row.category === categories.INSURANCE_KEY)
}

function getUniqueEffectiveDates(fixedCosts) {
  return Array.from(new Set(fixedCosts.map(e => e.effective_date)))
}

function constructContentChartObject( title, xAxis, dataSets, colors ) {
  const contentChartObj =
    {
    chartTitle: title,
    labels: xAxis,
    dataSet1: dataSets?.dataSet1,
    dataSet2: dataSets?.dataSet2,
    dataSet3: dataSets?.dataSet3,
    dataSet4: dataSets?.dataSet4,
    dataSet1Name: dataSets?.dataSet1Name,
    dataSet2Name: dataSets?.dataSet2Name,
    dataSet3Name: dataSets?.dataSet3Name,
    dataSet4Name: dataSets?.dataSet4Name,
    color1: colors?.color1,
    color2: colors?.color2,
    color3: colors?.color3,
    color4: colors?.color4,
    }
    return contentChartObj
}

/**
 *
 * @param {*} allFixedCosts all fixed costs within db
 * @returns contentChartObj constructed via helper method constructContentChartObject
 */
function extractChartData(allFixedCosts) {
  const livingEssentialsColors = {
    color1: '',
    color2: '',
    color3: '',
    color4: '',
  }
  const livingEssentialsFiltered = filterLivingEssentials(allFixedCosts)
  // unique effective dates as string array
  const livingEssentialsEffectiveDatesArr = getUniqueEffectiveDates(livingEssentialsFiltered)
  livingEssentialsEffectiveDatesArr.sort()
  // only read dates from datetime
  const livingEssentialsXaxis = livingEssentialsEffectiveDatesArr.map(e => e.substring(0,10))
  let livingEssentialsDs1 = []
  let livingEssentialsDs2 = []
  let livingEssentialsDs3 = []
  let livingEssentialsDs4 = []
  // for each unique date create an xAxis array with summed up monthly_cost values
  livingEssentialsEffectiveDatesArr.forEach( (xAxisEntry) => {
    livingEssentialsDs1.push(
      livingEssentialsFiltered
      .filter(e => e.category === categories.LIVING_ESSENTIALS_KEY)
      .filter(e => e.effective_date === xAxisEntry)
      .map((row) => row.monthly_cost)
      .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
    )
    livingEssentialsDs2.push(
      livingEssentialsFiltered
      .filter(e => e.category === categories.STUDENT_LOANS_KEY)
      .filter(e => e.effective_date === xAxisEntry)
      .map((row) => row.monthly_cost)
      .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
    )
    livingEssentialsDs3.push(
      livingEssentialsFiltered
      .filter(e => e.category === categories.INTERNET_AND_PHONE_KEY)
      .filter(e => e.effective_date === xAxisEntry)
      .map((row) => row.monthly_cost)
      .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
    )
    livingEssentialsDs4.push(
      livingEssentialsFiltered
      .filter(e => e.category === categories.INSURANCE_KEY)
      .filter(e => e.effective_date === xAxisEntry)
      .map((row) => row.monthly_cost)
      .reduce((partialSum, add) => partialSum + parseFloat(add), 0)
    )
  } )

  const livingEssentialsDataSets = {
    dataSet1: livingEssentialsDs1,
    dataSet2: livingEssentialsDs2,
    dataSet3: livingEssentialsDs3,
    dataSet4: livingEssentialsDs4,
    dataSet1Name: categories.LIVING_ESSENTIALS_VALUE,
    dataSet2Name: categories.STUDENT_LOANS_VALUE,
    dataSet3Name: categories.INTERNET_AND_PHONE_VALUE,
    dataSet4Name: categories.INSURANCE_VALUE,
  }
  let livingEssentials = constructContentChartObject(res.LIVING_ESSENTIALS, livingEssentialsXaxis, livingEssentialsDataSets, livingEssentialsColors)

  return { livingEssentials }
}

/**
 * Extracts information of specific fixed costs valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedCosts
 * @returns
 */
function extractCardData(specificFixedCosts) {
  let rentAndUtilities = constructContentCardObject(res.FIXED_COSTS_RENT_UTILITIES, null, '1.00', null, <LocalAtmOutlinedIcon sx={iconProperties}/>, 'no-img')
  let dslAndPhone = constructContentCardObject(res.FIXED_COSTS_DSL_PHONE, null, '1.00', null, <CellWifiOutlinedIcon sx={iconProperties}/>, 'no-img')
  let insurance = constructContentCardObject(res.FIXED_COSTS_INSURANCE, null, '1.00', null, <WaterDamageOutlinedIcon sx={iconProperties}/>, 'no-img' )
  let studentLoans = constructContentCardObject(res.FIXED_COSTS_STUDENT_LOANS, null, '1.00', null, <MoneyOffOutlinedIcon sx={iconProperties}/>, 'no-img')
  // Rent and Utilities
  let rentAndUtilitiesFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.LIVING_ESSENTIALS_KEY )
  rentAndUtilities.amount = Math.round(rentAndUtilitiesFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  rentAndUtilities.details = rentAndUtilitiesFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  // DSL & Telephone
  let dslAndPhoneFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.INTERNET_AND_PHONE_KEY )
  dslAndPhone.amount = Math.round(dslAndPhoneFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  dslAndPhone.details = dslAndPhoneFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  // Insurance
  let insuranceFiltered = specificFixedCosts.results
    .filter((row) => row.category === categories.INSURANCE_KEY)
  insurance.amount = Math.round(insuranceFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  insurance.details = insuranceFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  // Student Loans
  let studentLoansFiltered = specificFixedCosts.results
    .filter((row) =>  row.category === categories.STUDENT_LOANS_KEY)
  studentLoans.amount = Math.round(studentLoansFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  studentLoans.details = studentLoansFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  return {rentAndUtilities, dslAndPhone, insurance, studentLoans}
}

export default function FixedCosts_LivingEssentials( props ) {
  // Selected Specific Fixed Costs
  const [rentAndUtilitiesCard, setRentAndUtilitiesCard] = useState(null)
  const [dslAndPhoneCard, setDslAndPhoneCard] = useState(null)
  const [insuranceCard, setInsuranceCard] = useState(null)
  const [studentLoansCard, setStudentLoansCard] = useState(null)
  // All Fixed Costs Visualized in Barchart
  const [livingEssentialsChart, setLivingEssentialsChart] = useState(null)
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
      setLivingEssentialsChart(allFixedCostsChartData.livingEssentials)
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
        : '2023-08-01'); // Fallback auf übergebenes Datum
       let extractedFixedCosts = extractCardData(specificFixedCosts)
       setRentAndUtilitiesCard(extractedFixedCosts.rentAndUtilities)
       setDslAndPhoneCard(extractedFixedCosts.dslAndPhone)
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
    <Grid container spacing={2} >
      <Grid  sm={12} >
        <SelectDropdown
          selectLabel={res.DATE}
          selectItems={effectiveDateSelectItems}
          selectedValue={selectedEffectiveDate}
          handleSelect={handleSelect}
        />
      </Grid>
      <Grid xs={6} md={4} xl={3}>
        <ContentCardCosts {...rentAndUtilitiesCard}  />
      </Grid>
      <Grid xs={6} md={4} xl={3}>
        <ContentCardCosts {...studentLoansCard}  />
      </Grid>
      <Grid xs={6} md={4} xl={3}>
        <ContentCardCosts {...dslAndPhoneCard}  />
      </Grid>
      <Grid xs={6} md={4} xl={3}>
        <ContentCardCosts {...insuranceCard}  />
      </Grid>
      {/* All Living Essentials Bar Chart */}
      <Grid xs={0}  xl={1}></Grid>
      <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center" >
        <ContentVerticalBarChart {...livingEssentialsChart} dataSetCount={4} selectedLabel={selectedEffectiveDate}/>
      </Grid>
      <Grid xs={0} xl={1}></Grid>
    </Grid>
  )
}