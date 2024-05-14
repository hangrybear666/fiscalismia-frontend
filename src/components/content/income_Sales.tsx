import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ContentCard from '../minor/ContentCard_Costs';
import { resourceProperties as res } from '../../resources/resource_properties';
import { getVariableExpenseByCategory } from '../../services/pgConnections';
import { Box, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { getUniquePurchasingDates } from '../../utils/sharedFunctions';

/**
 * extracts all unique years within unique date array into an array
 * @param {*} allSales
 * @returns array of year strings in the format yyyy
 */
function getUniqueEffectiveDateYears(allSales: any) {
  const uniqueEffectiveDateArray = getUniquePurchasingDates(allSales);
  const uniqueYearSet = new Set(uniqueEffectiveDateArray.map((e: any) => e.substring(0, 4)));
  return [...uniqueYearSet].sort((a, b) => (a > b ? 1 : -1)); // return as ASC sorted Array
}

export type ContentCardSales = {
  header: string;
  amount: string | null;
  subtitle: string;
  details: string[] | null;
  icon: React.ReactNode;
  img: string | null;
  detailHeader: string | undefined;
  elevation?: number;
  imgHeight?: number;
};

function constructContentCardObjectSales(
  header: string,
  amount: number | null,
  subtitle: string,
  detailHeader: string | undefined,
  details: string[] | null,
  icon: React.ReactNode | string,
  img: string | null
) {
  // TODO img
  const contentCardObj = {
    header: header.trim(),
    amount: `${amount ? Math.round(amount) : ''}${res.CURRENCY_EURO}`,
    subtitle: subtitle,
    detailHeader: detailHeader, // logic unique to this function
    details: details,
    img: img
      ? img === res.NO_IMG
        ? null
        : img
      : `https://source.unsplash.com/random/?money&${Math.floor(Math.random() * 100)}`,
    icon: icon
  };
  return contentCardObj;
}

/**
 *  Extracts information of sales (variable expenses with category ='Sale')
 *  to display in cards dependent on the selected year
 * @param {*} sales
 * @returns
 */
function extractCardData(sales: any, selectedYear: number | string = 2023) {
  // ensure that sales have positive cost value
  let salesTransformed = sales.map((e: any) => {
    if (e.cost < 0) {
      e.cost = e.cost * -1;
    } else {
      console.warn('positive value found in sales. raw data malformed.');
    }
    return e;
  });
  // DISTINCT STORE SALE CARDS
  let storeBasedCards: ContentCardSales[] = [];
  const distinctSaleStores: string[] = Array.from(new Set(salesTransformed.map((e: any) => e.store)));
  // loop through all stores of sale and construct summed cost cards for each
  distinctSaleStores.forEach((store: string) => {
    const storeFilteredSales = salesTransformed.filter((e: any) => e.store === store);
    let distinctStoreCard = constructContentCardObjectSales(
      store,
      null,
      `${selectedYear === res.ALL ? res.OVER_TOTAL_PERIOD : `${res.INCOME_SALES_CARD_TOTAL_SALES_SUBTITLE} ${selectedYear}`}`,
      res.INCOME_SALES_CARD_DISTINCT_STORE_SALES_DETAILS_HEADER,
      null,
      null,
      res.NO_IMG
    );
    distinctStoreCard.amount = Math.round(
      storeFilteredSales
        .map((row: any) => parseFloat(row.cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    ).toFixed(2);
    distinctStoreCard.details = storeFilteredSales
      .filter((row: any) => row.cost > 100)
      .map((row: any) => row.description.trim());
    storeBasedCards.push(distinctStoreCard);
  });
  // TOTAL SALES
  let totalSales = constructContentCardObjectSales(
    res.INCOME_SALES_CARD_TOTAL_SALES_HEADER,
    null,
    `${selectedYear === res.ALL ? res.OVER_TOTAL_PERIOD : `${res.INCOME_SALES_CARD_TOTAL_SALES_SUBTITLE} ${selectedYear}`}`,
    undefined,
    null,
    null,
    res.NO_IMG
  );
  totalSales.amount = Math.round(
    salesTransformed
      .map((row: any) => parseFloat(row.cost))
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  return { totalSales, storeBasedCards };
}

interface Income_SalesProps {}

export default function Income_Sales(_props: Income_SalesProps) {
  const { palette, breakpoints } = useTheme();
  const [allSales, setAllSales] = useState<any>(null);
  const [selectedSales, setSelectedSales] = useState<any>();
  const [salesCard, setSalesCard] = useState<ContentCardSales>();
  const [distinctStoreSalesCard, setDistinctStoreSalesCard] = useState<ContentCardSales[]>();
  // year selection
  const [selectedYear, setSelectedYear] = useState<string>();
  const [yearSelectionData, setYearSelectionData] = useState<string[][]>();

  const tableHeadStyling = {
    backgroundColor: palette.primary.dark,
    '> th': { color: palette.common.white, letterSpacing: 1, fontWeight: 500 }
  };
  const tableRowStyling = {
    '&:nth-of-type(odd)': { backgroundColor: 'rgba(128,128,128,0.7)' },
    '&:nth-of-type(even)': { backgroundColor: 'rgba(184,184,184,0.8)' },
    '&:last-child td, &:last-child th': { border: 0 }
  };
  useEffect(() => {
    const getAllSales = async () => {
      let allSales = await getVariableExpenseByCategory('Sale');
      const uniqueYears = getUniqueEffectiveDateYears(allSales.results);
      setYearSelectionData(new Array(uniqueYears.concat(res.ALL))); // 2D Array for mapping ToggleButtonGroup as parent
      setAllSales(allSales);
    };
    getAllSales();
  }, []);

  const handleYearSelection = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
    setSelectedYear(newValue);
    if (newValue === res.ALL) {
      setSelectedSales(allSales.results);
      let extractedSales = extractCardData(allSales.results, res.ALL);
      setSalesCard(extractedSales.totalSales);
      setDistinctStoreSalesCard(extractedSales.storeBasedCards);
    } else {
      const filteredSales = allSales.results.filter((e: any) => e.purchasing_date.substring(0, 4) === newValue);
      setSelectedSales(filteredSales);
      let extractedSales = extractCardData(filteredSales, newValue);
      setSalesCard(extractedSales.totalSales);
      setDistinctStoreSalesCard(extractedSales.storeBasedCards);
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{ marginTop: 2 }} justifyContent="center">
        <Grid xs={0} lg={0.5} xl={1.5}></Grid>
        <Grid xs={12} lg={11} xl={9}>
          <Box>
            {yearSelectionData
              ? yearSelectionData.map((parent, index) => {
                  return (
                    <ToggleButtonGroup
                      key={index}
                      exclusive
                      value={selectedYear}
                      onChange={handleYearSelection}
                      sx={{ mt: 0.5, mb: 1 }}
                    >
                      {parent.map((child, index) => {
                        return (
                          <ToggleButton
                            key={index}
                            size="large"
                            value={child}
                            selected={child === selectedYear}
                            sx={{
                              borderRadius: 0,
                              paddingX: 3.25,
                              '&:hover': {
                                bgcolor: palette.mode === 'light' ? palette.grey[600] : palette.grey[600],
                                color: palette.common.white
                              },
                              '&.Mui-selected:hover': {
                                bgcolor: palette.mode === 'light' ? palette.grey[800] : palette.grey[500]
                              },
                              '&.Mui-selected': {
                                bgcolor: palette.mode === 'light' ? palette.grey[900] : palette.grey[400],
                                color: palette.mode === 'light' ? palette.common.white : palette.common.black,
                                boxShadow: palette.mode === 'light' ? `0px 0px 4px 2px ${palette.grey[700]}` : '',
                                transition: 'box-shadow 0.2s linear 0s'
                              },
                              '&.Mui-disabled': {
                                color: palette.text.disabled
                              }
                            }}
                          >
                            {child}
                          </ToggleButton>
                        );
                      })}
                    </ToggleButtonGroup>
                  );
                })
              : null}
          </Box>
        </Grid>
        <Grid xs={0} lg={0.5} xl={1.5}></Grid>
        {salesCard ? (
          <Grid xs={12} lg={4} xl={3}>
            <Stack spacing={2} sx={{ width: '100%' }}>
              <ContentCard {...salesCard} />
              {distinctStoreSalesCard
                ? distinctStoreSalesCard.map((card) => <ContentCard key={card.header} {...card} />)
                : null}
            </Stack>
          </Grid>
        ) : null}
        <Grid xs={12} lg={7} xl={6}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 0,
              minWidth: breakpoints.values.sm - 256
            }}
          >
            <Table sx={{ minWidth: 500 }} size="small">
              <TableHead>
                <TableRow sx={tableHeadStyling}>
                  <TableCell>{res.INCOME_SALES_THEADER_DESCRIPTION}</TableCell>
                  <TableCell align="right">{res.INCOME_SALES_THEADER_COST}</TableCell>
                  <TableCell>{res.INCOME_SALES_THEADER_STORE}</TableCell>
                  <TableCell>{res.INCOME_SALES_THEADER_DATE}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSales
                  ? selectedSales.map((row: any) => (
                      <TableRow key={row.id} sx={tableRowStyling}>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">{`${row.cost}${res.CURRENCY_EURO}`}</TableCell>
                        <TableCell>{row.store}</TableCell>
                        <TableCell>{row.purchasing_date}</TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
