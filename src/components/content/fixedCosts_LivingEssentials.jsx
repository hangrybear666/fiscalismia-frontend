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
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate } from '../../services/pgConnections';

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

function extractAndCondenseFixedCosts(fixedCosts) {
  let rentAndUtilities = constructContentCardObject(res.FIXED_COSTS_RENT_UTILITIES, null, '1.00', null, <LocalAtmOutlinedIcon sx={iconProperties}/>, 'no-img')
  let dslAndPhone = constructContentCardObject(res.FIXED_COSTS_DSL_PHONE, null, '1.00', null, <CellWifiOutlinedIcon sx={iconProperties}/>, 'no-img')
  let insurance = constructContentCardObject(res.FIXED_COSTS_INSURANCE, null, '1.00', null, <WaterDamageOutlinedIcon sx={iconProperties}/>, 'no-img' )
  let studentLoans = constructContentCardObject(res.FIXED_COSTS_STUDENT_LOANS, null, '1.00', null, <MoneyOffOutlinedIcon sx={iconProperties}/>, 'no-img')
  // Rent and Utilities
  let rentAndUtilitiesFiltered = fixedCosts.results
    .filter((row) => row.category === categories.LIVING_ESSENTIALS_KEY )
  rentAndUtilities.amount = Math.round(rentAndUtilitiesFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  rentAndUtilities.details = rentAndUtilitiesFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  // DSL & Telephone
  let dslAndPhoneFiltered = fixedCosts.results
    .filter((row) => row.category === categories.INTERNET_AND_PHONE_KEY )
  dslAndPhone.amount = Math.round(dslAndPhoneFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  dslAndPhone.details = dslAndPhoneFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  // Insurance
  let insuranceFiltered = fixedCosts.results
    .filter((row) => row.category === categories.INSURANCE_KEY)
  insurance.amount = Math.round(insuranceFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  insurance.details = insuranceFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  // Student Loans
  let studentLoansFiltered = fixedCosts.results
    .filter((row) =>  row.category === categories.STUDENT_LOANS_KEY)
  studentLoans.amount = Math.round(studentLoansFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  studentLoans.details = studentLoansFiltered
    .map((row) => row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.EURO))
  return {rentAndUtilities, dslAndPhone, insurance, studentLoans}
}

export default function FixedCosts_LivingEssentials( props ) {
  // Fixed Costs from DB
  const [fixedCosts, setFixedCosts] = useState([])
  const [rentAndUtilities, setRentAndUtilities] = useState(null)
  const [dslAndPhone, setDslAndPhone] = useState(null)
  const [insurance, setInsurance] = useState(null)
  const [studentLoans, setStudentLoans] = useState(null)


  useEffect(() => {
    const getFixedCosts = async() => {
       let results = await getFixedCostsByEffectiveDate('2023-08-01') // TODO Frontend Parameter mittels Select oder Datepicker
       setFixedCosts(results)
       let extractedFixedCosts = extractAndCondenseFixedCosts(results)
       setRentAndUtilities(extractedFixedCosts.rentAndUtilities)
       setDslAndPhone(extractedFixedCosts.dslAndPhone)
       setInsurance(extractedFixedCosts.insurance)
       setStudentLoans(extractedFixedCosts.studentLoans)
     }
     getFixedCosts();
     }, []
  )

  return (
    <Grid container spacing={2}>
      <Grid xs={6} md={4} xl={3}>
        <ContentCard {...rentAndUtilities}  />
      </Grid>
      <Grid xs={6} md={4} xl={3}>
        <ContentCard {...studentLoans}  />
      </Grid>
      <Grid xs={6} md={4} xl={3}>
        <ContentCard {...dslAndPhone}  />
      </Grid>
      <Grid xs={6} md={4} xl={3}>
        <ContentCard {...insurance}  />
      </Grid>
    </Grid>
  )
}