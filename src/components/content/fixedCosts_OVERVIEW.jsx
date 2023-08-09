import React, { useState, useEffect } from 'react';
import ContentCard from '../minor/ContentCard';
import Grid from '@mui/material/Unstable_Grid2';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import CellWifiOutlinedIcon from '@mui/icons-material/CellWifiOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { resourceProperties as res } from '../../resources/resource_properties';
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
  let monthlyTotalCost = constructContentCardObject(res.FIXED_COSTS_MONHTLY_COST, null, '1.00', null, null, 'https://source.unsplash.com/random/?bills')
  let rentAndUtilities = constructContentCardObject(res.FIXED_COSTS_RENT_UTILITIES, null, '1.00', null, <LocalAtmOutlinedIcon sx={iconProperties}/>, 'no-img')
  let dslAndPhone = constructContentCardObject(res.FIXED_COSTS_DSL_PHONE, null, '1.00', null, <CellWifiOutlinedIcon sx={iconProperties}/>, 'no-img')
  let sportsAndHealth = constructContentCardObject(res.FIXED_COSTS_SPORTS_HEALTH, null, '1.00', null, <FitnessCenterOutlinedIcon sx={iconProperties}/>, 'no-img')
  let mediaAndEntertainment = constructContentCardObject(res.FIXED_COSTS_MEDIA_ENTERTAINMENT, null, '1.00', null, <SubscriptionsOutlinedIcon sx={iconProperties}/>, 'no-img')
  let insurance = constructContentCardObject(res.FIXED_COSTS_INSURANCE, null, '1.00', null, null, 'no-img')
  let studentLoans = constructContentCardObject(res.FIXED_COSTS_STUDENT_LOANS, null, '1.00', null, null, 'no-img')
  // Monthly Total Amount
  monthlyTotalCost.amount = Math.round(fixedCosts.results
    .map((row) => row.monthly_cost)
    .reduce((partialSum, a) => partialSum + parseFloat(a), 0));
  // Rent and Utilities
  let rentAndUtilitiesFiltered = fixedCosts.results
    .filter((row) => row.description.toLowerCase().includes('miete') || row.description.toLowerCase().includes('strom')
      || row.description.toLowerCase().includes('gas') )
  rentAndUtilities.amount = Math.round(rentAndUtilitiesFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  rentAndUtilities.details = rentAndUtilitiesFiltered
    .map((row) => row.description.trim())
  // DSL & Telephone
  let dslAndPhoneFiltered = fixedCosts.results
    .filter((row) => row.description.toLowerCase().includes('dsl') || row.description.toLowerCase().includes('mobilfunk'))
  dslAndPhone.amount = Math.round(dslAndPhoneFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  dslAndPhone.details = dslAndPhoneFiltered
      .map((row) => row.description.trim())
  // Sports and Health
  let sportsAndHealthFiltered = fixedCosts.results
    .filter((row) => row.description.toLowerCase().includes('health') || row.description.toLowerCase().includes('supplements')
      || row.description.toLowerCase().includes('gym') || row.description.toLowerCase().includes('sports'))
  sportsAndHealth.amount = Math.round(sportsAndHealthFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  sportsAndHealth.details = sportsAndHealthFiltered
      .map((row) => row.description.trim())
  // Media and Entertainment
  let mediaAndEntertainmentFiltered = fixedCosts.results
    .filter((row) => row.description.toLowerCase().includes('abonnement'))
  mediaAndEntertainment.amount = Math.round(mediaAndEntertainmentFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  mediaAndEntertainment.details = mediaAndEntertainmentFiltered
      .map((row) => row.description.trim())
  // Insurance
  let insuranceFiltered = fixedCosts.results
    .filter((row) => row.description.toLowerCase().includes('versicherung'))
  insurance.amount = Math.round(insuranceFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  insurance.details = insuranceFiltered
      .map((row) => row.description.trim())
  // Student Loans
  let studentLoansFiltered = fixedCosts.results
    .filter((row) => row.description.toLowerCase().includes('kredit') || row.description.toLowerCase().includes('bafög'))
  studentLoans.amount = Math.round(studentLoansFiltered
    .map((row) => row.monthly_cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  studentLoans.details = studentLoansFiltered
      .map((row) => row.description.trim())
  return {monthlyTotalCost, rentAndUtilities, dslAndPhone, sportsAndHealth, mediaAndEntertainment, insurance, studentLoans}
}

export default function FixedCosts_OVERVIEW( props ) {
  // Default Template
  // const [header, setHeader ] = useState('Miete, Strom & Heizung')
  // const [amount, setAmount ] = useState('450€')
  // const [interval, setInterval ] = useState('monatlich')
  // const [details, setDetails ] = useState(['- 360€ Miete','- 50€ Strom','- 40€ Gas'])
  // const [img, setImg ] = useState('https://source.unsplash.com/random')
  // const [icon, setIcon ] = useState(<FireplaceIcon sx={iconProperties} />)
  // Fixed Costs from DB
  const [fixedCosts, setFixedCosts] = useState([])
  const [monthlyTotalCost, setMonthlyTotalCost] = useState(null)
  const [rentAndUtilities, setRentAndUtilities] = useState(null)
  const [dslAndPhone, setDslAndPhone] = useState(null)
  const [sportsAndHealth, setSportsAndHealth] = useState(null)
  const [mediaAndEntertainment, setMediaAndEntertainment] = useState(null)
  const [insurance, setInsurance] = useState(null)
  const [studentLoans, setStudentLoans] = useState(null)


  useEffect(() => {
    const getFixedCosts = async() => {
       let results = await getFixedCostsByEffectiveDate('2023-08-01') // TODO Frontend Parameter mittels Select oder Datepicker
       console.log(`results from fixed cost query:
        ${JSON.stringify(results)}`)
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
     }, []
  )

  return (
    <Grid container spacing={2}>
      {/* <Grid xs={6} md={4}>
        <ContentCard img={img} header={header} amount={amount} interval={interval} icon={icon} details={details} />
      </Grid>
      <Grid xs={6} md={4}>
        <ContentCard img={img} amount={amount} interval={interval}  />
      </Grid>
      <Grid xs={6} md={4}>
        <ContentCard img={img} amount={amount} details={details} />
      </Grid>
      <Grid xs={6} md={4}>
        <ContentCard header={header} details={details} />
      </Grid>
      <Grid xs={6} md={4}>
        <ContentCard header={header} icon={icon} details={details} />
      </Grid> */}

      {/* {fixedCosts?.results ?
      fixedCosts.results.map((row, index) => {
        let turnus = row.monthly_interval === '1.00' ? 'monatlich' : row.monthly_interval === '12.00' ? 'jährlich' : `alle ${row.monthly_interval} Monate`
        return (
        <Grid key={row.id} xs={4} md={3}>
          <ContentCard img={`https://source.unsplash.com/random/${index}`} header={row.description} interval={turnus} amount={row.billed_cost} />
        </Grid>
        )
      })
      : null} */}

      <Grid xs={12} sx={{ mb:3 }}>
        <ContentCard elevation={12} {...monthlyTotalCost}  />
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
    </Grid>
  )
}