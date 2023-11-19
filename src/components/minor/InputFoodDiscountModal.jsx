import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import SelectDropdown from './SelectDropdown';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { resourceProperties as res } from '../../resources/resource_properties';
import { postFoodItemDiscount } from '../../services/pgConnections';
import { Autocomplete, Stack } from '@mui/material';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/** helper function to validate decimal numbers */
function isNumeric(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}
/** helper function to validate dates in the format YYYY/MM/DD */
function dateValidation(dateStr) {
  const date = new Date(dateStr);
  return { isValid: !isNaN(date), date: date }
}

export default function InputFoodDiscountModal( props ) {
  const [open, setOpen] = React.useState(false);
  // Selection
  const { setDiscountAddedItemId, autoCompleteItemArray } = props
  const [selectedFoodItemId, setSelectedFoodItemId] = React.useState('');
  // Validation
  const [isFoodItemSelectionError, setIsFoodItemSelectionError] = React.useState(false);
  const [isPriceValidationError, setIsPriceValidationError] = React.useState(false);
  const [isStartDateValidationError, setIsStartDateValidationError] = React.useState(false);
  const [isEndDateValidationError, setIsEndDateValidationError] = React.useState(false);
  const [foodItemSelectionErrorMessage, setFoodItemSelectionErrorMessage] = React.useState('');
  const [discountPriceValidationErrorMessage, setDiscountPriceValidationErrorMessage] = React.useState('');
  const [startDateErrorMessage, setStartDateErrorMessage] = React.useState('');
  const [endDateErrorMessage, setEndDateErrorMessage] = React.useState('');
  // Inputs
  const [discountPrice, setDiscountPrice] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**
   * queries DB for food item discount information insertion via REST API
   * notifies user on success or error
   */
  const saveUserInput = async() => {
    const foodItemDiscountObj = {
      id:selectedFoodItemId,
      price:discountPrice,
      startDate:startDate,
      endDate:endDate,
    }
    const response = await postFoodItemDiscount(foodItemDiscountObj)
    if (response?.results[0]?.food_prices_dimension_key == selectedFoodItemId) {
      // this setter is called to force the frontend to update and refetch the data from db
      console.log("SUCCESSFULLY added discount to DB:")
      setOpen(false)
      setDiscountAddedItemId(selectedFoodItemId)
    } else {
      // TODO User Notification
      console.error(response)
    }
  }

  /* some basic validation of:
   * - Autocomplete Selection
   * - discount_price
   * - discount_start_date
   * - discount_end_date
   */
  const validateInput = (e) => {
    e.preventDefault();
    // Food Item Selection
    if (!isNumeric(selectedFoodItemId)) {
      setIsFoodItemSelectionError(true)
      setFoodItemSelectionErrorMessage(res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_FOOD_ITEM_SELECTION_ERROR_MSG)
    } else {
      setIsFoodItemSelectionError(false)
      setFoodItemSelectionErrorMessage('')
    }
    // Price Validation
    if (!isNumeric(discountPrice)) {
      setIsPriceValidationError(true)
      setDiscountPriceValidationErrorMessage(res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_PRICE_VALIDATION_ERROR_MSG)
    } else {
      setIsPriceValidationError(false)
      setDiscountPriceValidationErrorMessage('')
    }
    // Generic Start Date Validation
    if (!dateValidation(startDate).isValid) {
      setIsStartDateValidationError(true)
      setStartDateErrorMessage(res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG)
    } else {
      setIsStartDateValidationError(false)
      setStartDateErrorMessage('')
    }
    // Generic End Date Validation
    if (!dateValidation(startDate).isValid) {
      setIsEndDateValidationError(true)
      setEndDateErrorMessage(res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG)
    } else {
      setIsEndDateValidationError(false)
      setEndDateErrorMessage('')
    }
    // Specific Date Validation
    if (startDate > endDate) {
      setIsEndDateValidationError(true)
      setEndDateErrorMessage(res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE_BEFORE_START_DATE_VALIDATION_ERROR_MSG)
      setIsStartDateValidationError(true)
      setStartDateErrorMessage(res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE_BEFORE_START_DATE_VALIDATION_ERROR_MSG)
    }
    if (isPriceValidationError || isStartDateValidationError || isEndDateValidationError) {
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
      case "discount_price":
        setDiscountPrice(e.target.value.replace(',','.'))
        break;
      case "start_date":
        setStartDate(e.target.value)
        break;
      case "end_date":
        setEndDate(e.target.value)
        break;
    }
  }

  const handleAutoCompleteSelection = (event, newValue) => {
    setSelectedFoodItemId(newValue?.id ? newValue.id : null)
  }

  return (
    <>
    <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        sx={{ borderRadius:0,
          border: '1px solid rgba(0,0,0,0.7)',
          boxShadow: '3px 3px 8px 2px rgba(64,64,64, 0.7)',
          mb:0.8
            }}
          startIcon={<AddCircleIcon />}
          >
        {res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_OPEN}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          {/* AUTOCOMPLETE DROPDOWN FÜR FOOD ITEMS */}
          {autoCompleteItemArray
          ?
          <Stack>
            <Autocomplete
              disablePortal
              onChange={handleAutoCompleteSelection}
              options={autoCompleteItemArray}
              renderInput={(params) => <TextField {...params} label={res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_SELECTDROPDOWN_LABEL} sx={{ borderRadius:0 }}/>}
              sx={{ ml:0.8, width:'100%' }}
            />
            <Typography sx={{ 
              color: 'rgba(211,47,47,1.0)', 
              fontSize: 12,
              ml:1,
              mt:0.5,
              display: isFoodItemSelectionError ? 'inline' : 'none' }}>
                {foodItemSelectionErrorMessage}
            </Typography>
          </Stack>
          : null}
          {/* ANGEBOTSPREIS */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="discount_price">{res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_DISCOUNT_AMOUNT}</InputLabel>
            <Input
              id="discount_price"
              value={discountPrice}
              onChange={inputChangeListener}
              type="text"
              error={isPriceValidationError}
              startAdornment={<InputAdornment position="start">{res.CURRENCY_EURO}</InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{discountPriceValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* START DATUM */}
          <FormControl fullWidth sx={{ marginX: 1, mt:2 }} variant="standard">
            <InputLabel shrink={true} htmlFor="start_date">{res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_START_DATE}</InputLabel>
            <Input
              id="start_date"
              value={startDate}
              type="date"
              error={isStartDateValidationError}
              onChange={inputChangeListener}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{startDateErrorMessage}</FormHelperText>
          </FormControl>
          {/* END DATUM */}
          <FormControl fullWidth sx={{ marginX: 1, mt:2, mb:4 }} variant="standard">
            <InputLabel shrink={true} htmlFor="end_date">{res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE}</InputLabel>
            <Input
              id="end_date"
              value={endDate}
              type="date"
              error={isEndDateValidationError}
              onChange={inputChangeListener}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{endDateErrorMessage}</FormHelperText>
          </FormControl>
          {/* SPEICHERN */}
          <Button
            onClick={validateInput}
            sx={{ borderRadius:0,
                  margin:'0 auto',
                  ml:1,
                  border: '1px solid rgba(0,0,0,0.7)',
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