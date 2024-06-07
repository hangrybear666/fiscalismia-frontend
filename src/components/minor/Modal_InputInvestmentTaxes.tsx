import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import PercentIcon from '@mui/icons-material/Percent';
import MoneyIcon from '@mui/icons-material/Money';
import TagIcon from '@mui/icons-material/Tag';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SelectDropdown from './SelectDropdown';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import {
  resourceProperties as res,
  investmentInputCategories as selectionCategories
} from '../../resources/resource_properties';
import { postInvestments } from '../../services/pgConnections';
import { isNumeric, dateValidation, initializeReactDateInput, stringAlphabeticOnly } from '../../utils/sharedFunctions';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { TwelveCharacterString } from '../../types/custom/customTypes';

interface InputInvestmentTaxesModalProps {
  refreshParent: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Inputs a new investment with type BUY or SELL. calculates applicable taxes to be deducted based on user entry.
 * @param {InputInvestmentTaxesModalProps} props
 * @returns
 */
export default function InputInvestmentTaxesModal(props: InputInvestmentTaxesModalProps) {
  const { palette } = useTheme();
  const { refreshParent } = props;
  const [open, setOpen] = React.useState(false);
  // Validation
  const [isUnitPriceValidationError, setIsUnitPriceValidationError] = React.useState(false);
  const [unitPriceValidationErrorMessage, setUnitPriceValidationErrorMessage] = React.useState('');
  const [isFeeValidationError, setIsFeeValidationError] = React.useState(false);
  const [feeValidationErrorMessage, setFeeValidationErrorMessage] = React.useState('');
  const [isDateValidationError, setIsDateValidationError] = React.useState(false);
  const [dateErrorMessage, setDateErrorMessage] = React.useState('');
  const [isUnitsValidationError, setIsUnitsValidationError] = React.useState(false);
  const [unitsValidationErrorMessage, setUnitsValidationErrorMessage] = React.useState('');
  const [isIsinValidationError, setIsIsinValidationError] = React.useState(false);
  const [isinValidationErrorMessage, setIsinValidationErrorMessage] = React.useState('');
  const [isDescriptionValidationError, setIsDescriptionValidationError] = React.useState(false);
  const [descriptionValidationErrorMessage, setDescriptionValidationErrorMessage] = React.useState('');
  const [isProfitAmtValidationError, setIsProfitAmtValidationError] = React.useState(false);
  const [profitAmtValidationErrorMessage, setProfitAmtValidationErrorMessage] = React.useState('');
  const [isPctTaxedValidationError, setIsPctTaxedValidationError] = React.useState(false);
  const [pctTaxedValidationErrorMessage, setPctTaxedValidationErrorMessage] = React.useState('');

  // Inputs
  const [description, setDescription] = React.useState('');
  const [unitPrice, setUnitPrice] = React.useState('');
  const [fees, setFees] = React.useState('');
  const [executionDate, setExecutionDate] = React.useState(initializeReactDateInput(new Date()));
  const [units, setUnits] = React.useState('');
  const [isin, setIsin] = React.useState('');
  const [isOrderTypeSale, setIsOrderTypeSale] = React.useState(false);
  const [profitAmt, setProfitAmt] = React.useState('');
  const [pctTaxed, setPctTaxed] = React.useState(Number(100.0).toFixed(2));

  // Selection
  const [investmentTypeSelectItems] = React.useState(selectionCategories.ARRAY_INVESTMENT_TYPE);
  const [selectedInvestmentType, setSelectedInvestmentType] = React.useState(
    selectionCategories.ARRAY_INVESTMENT_TYPE[0]
  );
  const [marketplaceSelectItems] = React.useState(selectionCategories.ARRAY_MARKETPLACE);
  const [selectedMarketplace, setSelectedMarketplace] = React.useState(selectionCategories.ARRAY_MARKETPLACE[0]);
  const [orderTypeArray] = React.useState(new Array(selectionCategories.ARRAY_ORDER_TYPE));
  const [selectedOrderType, setSelectedOrderType] = React.useState(selectionCategories.ARRAY_ORDER_TYPE[0]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: `2px solid ${palette.secondary.main}`,
    boxShadow: 24,
    p: 4
  };

  /**
   * queries DB for investment and taxes insertion via REST API
   */
  const saveUserInput = async () => {
    const investmentAndTaxesObject = {
      execution_type: selectedOrderType,
      description: description.trim(),
      isin: isin as TwelveCharacterString,
      investment_type: selectedInvestmentType,
      marketplace: selectedMarketplace,
      units: parseInt(units),
      price_per_unit: parseFloat(Number(unitPrice).toFixed(2)),
      total_price: parseFloat((parseInt(units) * Number(unitPrice) + Number(fees)).toFixed(2)),
      fees: parseFloat(Number(fees).toFixed(2)),
      execution_date: new Date(executionDate),
      pct_of_profit_taxed: isOrderTypeSale ? parseFloat(Number(pctTaxed).toFixed(2)) : null,
      profit_amt: isOrderTypeSale ? parseFloat(Number(profitAmt).toFixed(2)) : null
    };
    const response = await postInvestments(investmentAndTaxesObject);
    if (response?.results[0]?.id) {
      // this setter is called to force the frontend to update and refetch the data from db
      console.log('SUCCESSFULLY added investments to DB:'); // TODO mit Growl und ID ersetzen
      console.log(response.results[0]);
      if (selectedOrderType === res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY && response?.taxesResults[0]?.id) {
        console.log('SUCCESSFULLY added investment_taxes to DB:'); // TODO mit Growl und ID ersetzen
        console.log(response.taxesResults[0]);
      }
      setOpen(false);
      // to refresh parent's table based on added food item after DB insertion
      refreshParent(Number(response.results[0].id));
    } else {
      // TODO User Notification
      console.error(response);
    }
  };

  const validateInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let errorPresent = false;
    // Fees Validation
    if (!isNumeric(fees)) {
      errorPresent = true;
      setIsFeeValidationError(true);
      setFeeValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PRICE_VALIDATION_ERROR_MSG);
    } else {
      setIsFeeValidationError(false);
      setFeeValidationErrorMessage('');
    }
    // Price Validation
    if (!isNumeric(unitPrice) || parseInt(Number(unitPrice).toFixed(0)) < 0) {
      errorPresent = true;
      setIsUnitPriceValidationError(true);
      setUnitPriceValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PRICE_VALIDATION_ERROR_MSG);
    } else {
      setIsUnitPriceValidationError(false);
      setUnitPriceValidationErrorMessage('');
    }
    // Generic Date Validation
    if (!dateValidation(executionDate).isValid) {
      errorPresent = true;
      setIsDateValidationError(true);
      setDateErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG);
    } else {
      setIsDateValidationError(false);
      setDateErrorMessage('');
    }
    // Units
    if (!isNumeric(units) || parseInt(Number(units).toFixed(0)) < 0) {
      errorPresent = true;
      setIsUnitsValidationError(true);
      setUnitsValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_UNITS_VALIDATION_ERROR_MSG);
    } else {
      setIsUnitsValidationError(false);
      setUnitsValidationErrorMessage('');
    }
    // ISIN
    if (!isin || isin == '' || isin?.length != 12 || !stringAlphabeticOnly(isin.substring(0, 2))) {
      errorPresent = true;
      setIsIsinValidationError(true);
      setIsinValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_ISIN_VALIDATION_ERROR_MSG);
    } else {
      setIsIsinValidationError(false);
      setIsinValidationErrorMessage('');
    }
    // description
    if (!description || description == '' || description?.length < 5 || description?.length > 50) {
      errorPresent = true;
      setIsDescriptionValidationError(true);
      setDescriptionValidationErrorMessage(
        res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_DESCRIPTION_VALIDATION_ERROR_MSG
      );
    } else {
      setIsDescriptionValidationError(false);
      setDescriptionValidationErrorMessage('');
    }
    // ONLY VALIDATE FOR SALES
    if (isOrderTypeSale) {
      // Pct Taxed Validation
      if (
        !isNumeric(pctTaxed) ||
        parseFloat(Number(pctTaxed).toFixed(2)) > 100.0 ||
        parseInt(Number(pctTaxed).toFixed(0)) < 0
      ) {
        errorPresent = true;
        setIsPctTaxedValidationError(true);
        setPctTaxedValidationErrorMessage(
          res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PCT_TAXED_VALIDATION_ERROR_MSG
        );
      } else {
        setIsPctTaxedValidationError(false);
        setPctTaxedValidationErrorMessage('');
      }
      // Profit Amount
      if (!isNumeric(profitAmt)) {
        errorPresent = true;
        setIsProfitAmtValidationError(true);
        setProfitAmtValidationErrorMessage(
          res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PROFIT_AMT_VALIDATION_ERROR_MSG
        );
      } else {
        setIsProfitAmtValidationError(false);
        setProfitAmtValidationErrorMessage('');
      }
    }
    if (errorPresent) {
      // Errors present => return
      return;
    } else {
      // Errors missing => save to db
      saveUserInput();
    }
  };

  const inputChangeListener = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    switch (e.target.id) {
      case 'unit_price':
        setUnitPrice(e.target.value.replace(',', '.'));
        break;
      case 'fees':
        setFees(e.target.value.replace(',', '.'));
        break;
      case 'execution_date':
        setExecutionDate(e.target.value);
        break;
      case 'units':
        setUnits(e.target.value.replace('.', '').replace(',', ''));
        break;
      case 'description':
        setDescription(e.target.value);
        break;
      case 'isin':
        setIsin(e.target.value.replace('-', ''));
        break;
      case 'profit_amt':
        setProfitAmt(e.target.value.replace(',', '.'));
        break;
      case 'pct_taxed':
        setPctTaxed(e.target.value.replace(',', '.'));
        break;
    }
  };

  const handleInvestmentTypeSelect = (selection: string) => {
    setSelectedInvestmentType(selection);
  };

  const handleMarketplaceSelect = (selection: string) => {
    setSelectedMarketplace(selection);
  };

  const handleOrderTypeSelect = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue === res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY) {
      setIsOrderTypeSale(true);
    } else {
      setIsOrderTypeSale(false);
    }
    setSelectedOrderType(newValue);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outlined"
        color="secondary"
        sx={{
          borderRadius: 0,
          border: `1px solid  ${palette.border.dark}`,
          boxShadow: palette.mode === 'light' ? `3px 3px 8px 2px ${palette.grey[700]}` : '',
          mb: 0.8
        }}
        startIcon={<AddCircleIcon />}
      >
        {res.MINOR_INPUT_FOOD_ITEM_MODAL_OPEN_BUTTON}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box>
            {orderTypeArray
              ? orderTypeArray.map((parent, index) => {
                  return (
                    <ToggleButtonGroup
                      key={index}
                      exclusive
                      value={selectedOrderType}
                      onChange={handleOrderTypeSelect}
                      sx={{ mt: 0.5, mb: 1, ml: 1, justifyContent: 'center', display: 'flex' }}
                    >
                      {parent.map((child, index) => {
                        return (
                          <ToggleButton
                            key={index}
                            size="medium"
                            value={child}
                            selected={child === selectedOrderType}
                            sx={{
                              borderRadius: 0,
                              paddingX: 11.0,
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
          {/* INVESTMENT TYPE */}
          {investmentTypeSelectItems ? (
            <Box sx={{ ml: 1, mr: 0, mt: 2.5 }}>
              <SelectDropdown
                selectLabel={res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_INVESTMENT_TYPE_SELECT}
                selectItems={investmentTypeSelectItems}
                selectedValue={selectedInvestmentType}
                handleSelect={handleInvestmentTypeSelect}
              />
            </Box>
          ) : null}
          {/* MARKETPLACE SELECTION */}
          {marketplaceSelectItems ? (
            <Box sx={{ ml: 1, mr: 0, mt: 2.5, mb: 1.5 }}>
              <SelectDropdown
                selectLabel={res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_MARKETPLACE_SELECT}
                selectItems={marketplaceSelectItems}
                selectedValue={selectedMarketplace}
                handleSelect={handleMarketplaceSelect}
              />
            </Box>
          ) : null}
          {/* DESCRIPTION */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="description">
              {res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_DESCRIPTION}
            </InputLabel>
            <Input
              id="description"
              value={description}
              onChange={inputChangeListener}
              type="text"
              error={isDescriptionValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <DriveFileRenameOutlineIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{descriptionValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* ISIN */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="isin">{res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_ISIN}</InputLabel>
            <Input
              id="isin"
              value={isin}
              onChange={inputChangeListener}
              type="text"
              error={isIsinValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <QueryStatsIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{isinValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* UNITS */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="units">{res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_UNITS}</InputLabel>
            <Input
              id="units"
              value={units}
              onChange={inputChangeListener}
              type="text"
              error={isUnitsValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <TagIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{unitsValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* UNIT PRICE */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="unit_price">
              {res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_UNIT_PRICE}
            </InputLabel>
            <Input
              id="unit_price"
              value={unitPrice}
              onChange={inputChangeListener}
              type="text"
              error={isUnitPriceValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <EuroSymbolIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{unitPriceValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* FEES */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="fees">{res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_FEES}</InputLabel>
            <Input
              id="fees"
              value={fees}
              onChange={inputChangeListener}
              type="text"
              error={isFeeValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <EuroSymbolIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{feeValidationErrorMessage}</FormHelperText>
          </FormControl>
          {isOrderTypeSale ? (
            <>
              {/* PROFIT AMOUNT */}
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="profit_amt">
                  {res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_PROFIT_AMT}
                </InputLabel>
                <Input
                  id="profit_amt"
                  value={profitAmt}
                  onChange={inputChangeListener}
                  type="text"
                  error={isProfitAmtValidationError}
                  startAdornment={
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  }
                />
                <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{profitAmtValidationErrorMessage}</FormHelperText>
              </FormControl>
              {/* PERCENTAGE OF PROFITS TAXED */}
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="pct_taxed">
                  {res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_PCT_TAXED}
                </InputLabel>
                <Input
                  id="pct_taxed"
                  value={pctTaxed}
                  onChange={inputChangeListener}
                  type="text"
                  error={isPctTaxedValidationError}
                  startAdornment={
                    <InputAdornment position="start">
                      <PercentIcon />
                    </InputAdornment>
                  }
                />
                <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{pctTaxedValidationErrorMessage}</FormHelperText>
              </FormControl>
            </>
          ) : null}
          {/* EXECUTION DATE */}
          <FormControl fullWidth sx={{ marginX: 1, mt: 2 }} variant="standard">
            <InputLabel htmlFor="execution_date">
              {res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_EXECUTION_DATE}
            </InputLabel>
            <Input
              id="execution_date"
              value={executionDate}
              onChange={inputChangeListener}
              type="date"
              error={isDateValidationError}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{dateErrorMessage}</FormHelperText>
          </FormControl>
          {/* SPEICHERN */}
          <Button
            onClick={validateInput}
            sx={{
              borderRadius: 0,
              margin: '0 auto',
              mt: 2,
              ml: 1,
              border: `1px solid ${palette.border.dark}`,
              width: '100%',
              boxShadow: '3px 3px 5px 2px rgba(64,64,64, 0.7)'
            }}
            variant="contained"
            endIcon={<FileDownloadDoneIcon />}
          >
            {res.SAVE}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
