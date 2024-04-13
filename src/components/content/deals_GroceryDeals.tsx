import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import ContentCardDiscounts, { ContentCardDiscount } from '../minor/ContentCard_Discounts';
import { resourceProperties as res, serverConfig } from '../../resources/resource_properties';
import { getCurrentFoodDiscounts, getAllFoodPricesAndDiscounts } from '../../services/pgConnections';
import InputFoodDiscountModal from '../minor/Modal_InputFoodDiscount';

/**
 * extracts relevant fields from the db query result
 * in order to populate one card for each discounted item.
 * @param {*} allFoodDiscounts db query result
 */
function extractCardData(allFoodDiscounts: any): ContentCardDiscount[] {
  let discountedFoodItemCards: ContentCardDiscount[] = new Array();
  allFoodDiscounts.forEach((e: any) => {
    const imageStr = e.filepath ? serverConfig.API_BASE_URL.concat('/').concat(e.filepath) : res.NO_IMG;
    const contentCardObj = {
      foodItemId: e.id,
      header: `${e.food_item} - ${e.brand}`.trim(),
      subtitle: `${res.DEALS_GROCERY_DEALS_CONTENT_CARD_WEIGHT} ${e.weight}${res.GRAMS}`,
      originalPrice: `${e.price}${res.CURRENCY_EURO}`,
      discountPrice: `${e.discount_price}${res.CURRENCY_EURO}`,
      discountPercentage: `${Math.round(e.reduced_by_pct)}${res.SYMBOL_PERCENT}`,
      store: e.store,
      startDate: `${res.DEALS_GROCERY_DEALS_CONTENT_CARD_START_DATE_STR} ${e.discount_start_date}`,
      endDate: `${res.DEALS_GROCERY_DEALS_CONTENT_CARD_END_DATE_STR} ${e.discount_end_date}`,
      dealDuration: `${res.DEALS_GROCERY_DEALS_CONTENT_CARD_DEAL_DURATION_STR}: ${e.discount_days_duration} ${res.DAYS}`,
      daysLeft:
        e.starts_in_days <= 0
          ? e.ends_in_days == 1
            ? `noch heute und morgen gültig`
            : e.ends_in_days == 0
              ? `letzter Tag der Gültigkeit`
              : `noch ${e.ends_in_days} Tage gültig`
          : null,
      startsInDays:
        e.starts_in_days > 0
          ? e.starts_in_days == 1
            ? `gültig ab morgen`
            : `startet in ${e.starts_in_days} Tagen`
          : null,
      details: null,
      img: imageStr
        ? imageStr === res.NO_IMG
          ? null
          : imageStr
        : `https://source.unsplash.com/random/?groceries&${Math.floor(Math.random() * 100)}`
    };
    discountedFoodItemCards.push(contentCardObj);
  });
  return discountedFoodItemCards;
}
/**
 * 1) Transforms a list of Objects from the db into a map of key:value pairs
 * -> key is the selected label
 * -> value is the food item ID for discount price insertion into the db
 * 2) Transforms a list of Objects from the db into an array of selection labels for the dropdown
 * 3) Transforms a list of Objects from the db into an array of autocomplete labels and additional information
 * @param {*} allFoodPrices selectItemArray: for dropdown,
 * selectItemLabelValueMap: for finding ID of selected label
 * autoCompleteItemArray: Array with label for input completion and any other desired information
 * @returns
 */
function getFoodItemSelectionDataStructures(allFoodPrices: any): {
  autoCompleteItemArray: { label: string; id: number }[];
} {
  const autoCompleteItemArray = new Array();
  allFoodPrices.forEach((e: any, i: number) => {
    autoCompleteItemArray[i] = { label: `${e.food_item} - ${e.brand} | ${e.store}`, id: e.id };
  });
  // return { selectItemArray, selectItemLabelValueMap, autoCompleteItemArray}
  return { autoCompleteItemArray };
}

interface Deals_GroceryDealsProps {}

export default function Deals_GroceryDeals(_props: Deals_GroceryDealsProps) {
  const { palette } = useTheme();
  const [foodPricesAndDiscounts, setFoodPricesAndDiscounts] = useState<any>();
  const [discountedItemCards, setDiscountedItemCards] = useState<ContentCardDiscount[]>([]);
  const [allFoodItemArrayForAutoComplete, setAllFoodItemArrayForAutoComplete] = useState<
    { label: string; id: number }[]
  >([]);
  // this setter is called from the Modal after db insertion to force the frontend to update and refetch the data from db
  const [discountAddedItemId, setDiscountAddedItemId] = useState<number | undefined>();

  useEffect(() => {
    const getAllPricesAndDiscounts = async () => {
      let allFoodDiscounts = await getCurrentFoodDiscounts();
      let allFoodItems = await getAllFoodPricesAndDiscounts();
      const selectionInfoForModal = getFoodItemSelectionDataStructures(allFoodItems.results);
      const autoCompleteItemArray = selectionInfoForModal.autoCompleteItemArray;
      setAllFoodItemArrayForAutoComplete(autoCompleteItemArray);
      setFoodPricesAndDiscounts(allFoodDiscounts.results);
      setDiscountedItemCards(extractCardData(allFoodDiscounts.results));
    };
    getAllPricesAndDiscounts();
  }, [discountAddedItemId]);

  const tableHeadStyling = {
    backgroundColor: palette.primary.dark,
    '> th': { color: palette.common.white, letterSpacing: 1, fontWeight: 500 }
  };
  const tableRowStyling = {
    '&:nth-of-type(odd)': { backgroundColor: 'rgba(128,128,128,0.7)' },
    '&:nth-of-type(even)': { backgroundColor: 'rgba(184,184,184,0.8)' },
    '&:last-child td, &:last-child th': { border: 0 }
  };

  return (
    <React.Fragment>
      <InputFoodDiscountModal
        setDiscountAddedItemId={setDiscountAddedItemId}
        autoCompleteItemArray={allFoodItemArrayForAutoComplete}
      />
      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={tableHeadStyling}>
              <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_FOODITEM}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                {res.DEALS_GROCERY_DEALS_THEADER_BRAND}
              </TableCell>
              <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_STORE}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                {res.DEALS_GROCERY_DEALS_THEADER_ORIGINAL_PRICE}
              </TableCell>
              <TableCell align="right">{res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_PRICE}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                {res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_AMOUNT}
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                {res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_PCT}
              </TableCell>
              <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_START_DATE}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                {res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_END_DATE}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodPricesAndDiscounts
              ? foodPricesAndDiscounts.map((row: any) => (
                  <TableRow key={row.id + row.discount_start_date} sx={tableRowStyling}>
                    <TableCell>{row.food_item}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.brand}</TableCell>
                    <TableCell>{row.store}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                      {row.price}
                      {res.CURRENCY_EURO}
                    </TableCell>
                    <TableCell align="right">
                      {row.discount_price}
                      {res.CURRENCY_EURO}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                      {row.reduced_by_amount}
                      {res.CURRENCY_EURO}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                      {row.reduced_by_pct}
                      {res.SYMBOL_PERCENT}
                    </TableCell>
                    <TableCell>{row.discount_start_date}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.discount_end_date}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} sx={{ marginTop: 1.5 }}>
        {discountedItemCards
          ? discountedItemCards.map((foodItem: any) => (
              <Grid key={foodItem.foodItemId + foodItem.startDate} xs={12} md={6} lg={4} xl={3}>
                <ContentCardDiscounts elevation={3} {...foodItem} imgHeight={150} />
              </Grid>
            ))
          : null}
      </Grid>
    </React.Fragment>
  );
}
