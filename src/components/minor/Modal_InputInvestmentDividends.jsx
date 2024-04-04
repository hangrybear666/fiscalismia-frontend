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
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import SelectDropdown from './SelectDropdown';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { resourceProperties as res, investmentInputCategories as selectionCategories } from '../../resources/resource_properties';
import { postDividends } from '../../services/pgConnections';
import { isNumeric, dateValidation, initializeReactDateInput, stringAlphabeticOnly } from '../../utils/sharedFunctions';

export default function InputInvestmentDividendsModal( props ) {
  const { palette } = useTheme();
  const { refreshParent, isinSelection } = props
  const [open, setOpen] = React.useState(false);
  // Validation
  const [isDateValidationError, setIsDateValidationError] = React.useState(false);
  const [dateErrorMessage, setDateErrorMessage] = React.useState('');
  const [isDividendAmountValidationError, setIsDividendAmountValidationError] = React.useState(false);
  const [dividendAmountValidationErrorMessage, setDividendAmountValidationErrorMessage] = React.useState('');
  const [isPctTaxedValidationError, setIsPctTaxedValidationError] = React.useState(false);
  const [pctTaxedValidationErrorMessage, setPctTaxedValidationErrorMessage] = React.useState('');
  const [isSelectedIsinValidationError, setIsSelectedIsinValidationError] = React.useState(false);
  const [selectedIsinValidationErrorMessage, setSelectedIsinValidationErrorMessage] = React.useState('');

  // Inputs
  const [dividendDate, setDividendDate] = React.useState(initializeReactDateInput(new Date()));
  const [dividendAmount, setDividendAmount] = React.useState('');
  const [pctTaxed, setPctTaxed] = React.useState(Number(100.00).toFixed(2));

  // Selection
  const [isinSelectItems,] = React.useState(isinSelection);
  const [selectedIsin, setSelectedIsin] = React.useState('');
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
    p: 4,
  };

  /**
   * queries DB for dividend and taxes insertion via REST API
   */
  const saveUserInput = async() => {
    const dividendsObject = {
      isin: selectedIsin,
      dividendAmount: Number(dividendAmount).toFixed(2),
      dividendDate: dividendDate,
      pctOfProfitTaxed: pctTaxed,
      profitAmount: Number(dividendAmount).toFixed(2),

    }
    const response = await postDividends(dividendsObject)
    if (response?.results[0]?.id) {
      // this setter is called to force the frontend to update and refetch the data from db
      console.log("SUCCESSFULLY added investments to DB:")// TODO mit Growl und ID ersetzen
      console.log(response.results[0])
      if (response?.taxesResults[0]?.id) {
        console.log("SUCCESSFULLY added investment_taxes to DB:")// TODO mit Growl und ID ersetzen
        console.log(response.taxesResults[0])
      }
      setOpen(false)
      // to refresh parent's table based on added food item after DB insertion
      refreshParent(response.results[0].id)
    } else {
      // TODO User Notification
      console.error(response)
    }
  }

 const validateInput = (e) => {
   e.preventDefault();
   let errorPresent = false;
    // Dividend Amount
    if (!isNumeric(dividendAmount) || Number(dividendAmount).toFixed(0) < 0) {
      errorPresent = true
      setIsDividendAmountValidationError(true)
      setDividendAmountValidationErrorMessage(res.MINOR_INPUT_DIVIDEND_MODAL_DIVIDEND_AMOUNT_VALIDATION_ERROR_MSG)
    } else {
      setIsDividendAmountValidationError(false)
      setDividendAmountValidationErrorMessage('')
    }
    // Generic Date Validation
    if (!dateValidation(dividendDate).isValid) {
      errorPresent = true
      setIsDateValidationError(true)
      setDateErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG)
    } else {
      setIsDateValidationError(false)
      setDateErrorMessage('')
    }
    // Pct Taxed Validation
    if (!isNumeric(pctTaxed) || Number(pctTaxed).toFixed(2) > 100.00 || Number(pctTaxed).toFixed(0) < 0) {
      errorPresent = true
      setIsPctTaxedValidationError(true)
      setPctTaxedValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PCT_TAXED_VALIDATION_ERROR_MSG)
    } else {
      setIsPctTaxedValidationError(false)
      setPctTaxedValidationErrorMessage('')
    }
    // Selected ISIN
    if (!selectedIsin || selectedIsin?.length < 12) {
      errorPresent = true
      setIsSelectedIsinValidationError(true)
      setSelectedIsinValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_ISIN_VALIDATION_ERROR_MSG)
    } else {
      setIsPctTaxedValidationError(false)
      setPctTaxedValidationErrorMessage('')
    }
    if (errorPresent) {
      // Errors present => return
      return
    } else {
      // Errors missing => save to db
      saveUserInput()
    }
  }

  const inputChangeListener = (e) => {
    e.preventDefault();
    switch (e.target.id) {
      case "dividend_date":
        setDividendDate(e.target.value)
        break;
      case "dividend_amount":
        setDividendAmount(e.target.value.replace(',','.'))
        break;
      case "pct_taxed":
        setPctTaxed(e.target.value.replace(',','.'))
        break;

    }
  }

  const handleIsinSelect = (selection) => {
    setSelectedIsin(selection)
  }

  return (
    <>
    <Button
        onClick={handleOpen}
        variant="outlined"
        color="secondary"
        sx={{ borderRadius:0,
          border: `1px solid  ${palette.border.dark}`,
          boxShadow: palette.mode === 'light' ?  `3px 3px 8px 2px ${palette.grey[700]}` : '',
          mb:0.8
            }}
          startIcon={<AddCircleIcon />}
          >
        {res.MINOR_INPUT_DIVIDEND_MODAL_OPEN_BUTTON}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          {/* ISIN SELECTION */}
          {isinSelectItems
          ? <Box sx={{ ml:1, mr:0, mt:2.5 }}>
              <SelectDropdown
                sx={{ m:1 }}
                selectLabel={res.MINOR_INPUT_DIVIDEND_MODAL_INPUT_ISIN_SELECT}
                selectItems={isinSelectItems}
                selectedValue={selectedIsin}
                handleSelect={handleIsinSelect}
              />
            <FormControl fullWidth sx={{ mt: 0.2, display: isSelectedIsinValidationError ? 'inline' : 'none' }} variant="standard">
              <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{selectedIsinValidationErrorMessage}</FormHelperText>
            </FormControl>
            </Box>
          : null}
          {/* DIVIDEND DATE */}
          <FormControl fullWidth sx={{ marginX: 1, mt:2 }} variant="standard">
            <InputLabel htmlFor="dividend_date">{res.MINOR_INPUT_DIVIDEND_MODAL_INPUT_DIVIDEND_DATE}</InputLabel>
            <Input
              id="dividend_date"
              value={dividendDate}
              onChange={inputChangeListener}
              type="date"
              error={isDateValidationError}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{dateErrorMessage}</FormHelperText>
          </FormControl>
          {/* DIVIDEND AMOUNT */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="dividend_amount">{res.MINOR_INPUT_DIVIDEND_MODAL_INPUT_DIVIDEND_AMT}</InputLabel>
            <Input
              id="dividend_amount"
              value={dividendAmount}
              onChange={inputChangeListener}
              type="text"
              error={isDividendAmountValidationError}
              startAdornment={<InputAdornment position="start"><EuroSymbolIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{dividendAmountValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* PERCENTAGE OF PROFITS TAXED */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="pct_taxed">{res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_PCT_TAXED}</InputLabel>
            <Input
              id="pct_taxed"
              value={pctTaxed}
              onChange={inputChangeListener}
              type="text"
              error={isPctTaxedValidationError}
              startAdornment={<InputAdornment position="start"><PercentIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{pctTaxedValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* SPEICHERN */}
          <Button
            onClick={validateInput}
            sx={{ borderRadius:0,
                  margin:'0 auto',
                  mt:2,
                  ml:1,
                  border: `1px solid ${palette.border.dark}`,
                  width:'100%',
                  boxShadow: '3px 3px 5px 2px rgba(64,64,64, 0.7)',
                  }}
            variant="contained"
            endIcon={<FileDownloadDoneIcon />}>
            {res.SAVE}
          </Button>
        </Box>
      </Modal>
    </>
  );
}