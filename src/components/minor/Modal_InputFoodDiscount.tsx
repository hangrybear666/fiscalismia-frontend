import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { resourceProperties as res } from '../../resources/resource_properties';
import { postFoodItemDiscount } from '../../services/pgConnections';
import { Autocomplete, Stack } from '@mui/material';
import { isNumeric, dateValidation } from '../../utils/sharedFunctions';
import { locales } from '../../utils/localeConfiguration';
import { toast } from 'react-toastify';
import { toastOptions } from '../../utils/sharedFunctions';

interface InputFoodDiscountModalProps {
  setDiscountAddedItemId: React.Dispatch<React.SetStateAction<number | undefined>>;
  autoCompleteItemArray: { label: string; id: number }[];
}

/**
 * Dialog Modal for inserting new temporary grocery deals into db.
 * Has a bunch of validation to ensure data consistency and applicable error messaging.
 * @param {InputFoodDiscountModalProps} props
 * @returns
 */
export default function InputFoodDiscountModal(props: InputFoodDiscountModalProps) {
  const { palette } = useTheme();
  const [open, setOpen] = React.useState(false);
  // Selection
  const { setDiscountAddedItemId, autoCompleteItemArray } = props;
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: `2px solid ${palette.primary.main}`,
    boxShadow: 24,
    p: 4
  };
  /**
   * queries DB for food item discount information insertion via REST API
   * notifies user on success or error
   */
  const saveUserInput = async () => {
    const foodItemDiscountObj = {
      id: parseInt(selectedFoodItemId),
      price: parseFloat(Number(discountPrice).toFixed(2)),
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };
    const response = await postFoodItemDiscount(foodItemDiscountObj);
    if (parseInt(response?.results[0]?.food_prices_dimension_key) === parseInt(selectedFoodItemId)) {
      toast.success(locales().NOTIFICATIONS_FOOD_ITEM_DISCOUNT_ADDED_SUCCESSFULLY(selectedFoodItemId), toastOptions);
      setOpen(false);
      // this setter is called to force the frontend to update and refetch the data from db
      setDiscountAddedItemId(Number(selectedFoodItemId));
    } else {
      toast.error(locales().NOTIFICATIONS_FOOD_ITEM_DISCOUNT_ADDED_ERROR, toastOptions);
    }
  };

  /* some basic validation of:
   * - Autocomplete Selection
   * - discount_price
   * - discount_start_date
   * - discount_end_date
   */
  const validateInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let errorPresent = false;
    // Food Item Selection
    if (!isNumeric(selectedFoodItemId)) {
      errorPresent = true;
      setIsFoodItemSelectionError(true);
      setFoodItemSelectionErrorMessage(locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_FOOD_ITEM_SELECTION_ERROR_MSG);
    } else {
      setIsFoodItemSelectionError(false);
      setFoodItemSelectionErrorMessage('');
    }
    // Price Validation
    if (!isNumeric(discountPrice)) {
      errorPresent = true;
      setIsPriceValidationError(true);
      setDiscountPriceValidationErrorMessage(locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_PRICE_VALIDATION_ERROR_MSG);
    } else {
      setIsPriceValidationError(false);
      setDiscountPriceValidationErrorMessage('');
    }
    // Generic Start Date Validation
    if (!dateValidation(startDate).isValid) {
      errorPresent = true;
      setIsStartDateValidationError(true);
      setStartDateErrorMessage(locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG);
    } else {
      setIsStartDateValidationError(false);
      setStartDateErrorMessage('');
    }
    // Generic End Date Validation
    if (!dateValidation(startDate).isValid) {
      errorPresent = true;
      setIsEndDateValidationError(true);
      setEndDateErrorMessage(locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG);
    } else {
      setIsEndDateValidationError(false);
      setEndDateErrorMessage('');
    }
    // Specific Date Validation
    if (startDate > endDate) {
      errorPresent = true;
      setIsEndDateValidationError(true);
      setEndDateErrorMessage(locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE_BEFORE_START_DATE_VALIDATION_ERROR_MSG);
      setIsStartDateValidationError(true);
      setStartDateErrorMessage(
        locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE_BEFORE_START_DATE_VALIDATION_ERROR_MSG
      );
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
      case 'discount_price':
        setDiscountPrice(e.target.value.replace(',', '.'));
        break;
      case 'start_date':
        setStartDate(e.target.value);
        break;
      case 'end_date':
        setEndDate(e.target.value);
        break;
    }
  };

  const handleAutoCompleteSelection = (
    _event: React.SyntheticEvent,
    newValue: { label: string; id: number } | null
  ) => {
    if (newValue?.id && newValue.id > 0) {
      setSelectedFoodItemId(newValue.id.toFixed(0));
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="secondary"
        sx={{
          borderRadius: 0,
          border: `1px solid  ${palette.border.dark}`,
          boxShadow: palette.mode === 'light' ? `3px 3px 8px 2px ${palette.grey[700]}` : '',
          mb: 0.8
        }}
        startIcon={<AddCircleIcon />}
      >
        {locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_OPEN}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* AUTOCOMPLETE DROPDOWN FÜR FOOD ITEMS */}
          {autoCompleteItemArray ? (
            <Stack>
              <Autocomplete
                disablePortal
                selectOnFocus
                onChange={handleAutoCompleteSelection}
                options={autoCompleteItemArray}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_SELECTDROPDOWN_LABEL}
                    sx={{ borderRadius: 0 }}
                  />
                )}
                sx={{ ml: 0.8, width: '100%' }}
              />
              <Typography
                sx={{
                  color: palette.error.main,
                  fontSize: 12,
                  ml: 1,
                  mt: 0.5,
                  display: isFoodItemSelectionError ? 'inline' : 'none'
                }}
              >
                {foodItemSelectionErrorMessage}
              </Typography>
            </Stack>
          ) : null}
          {/* ANGEBOTSPREIS */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="discount_price">
              {locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_DISCOUNT_AMOUNT}
            </InputLabel>
            <Input
              id="discount_price"
              value={discountPrice}
              onChange={inputChangeListener}
              type="text"
              error={isPriceValidationError}
              startAdornment={<InputAdornment position="start">{res.CURRENCY_EURO}</InputAdornment>}
            />
            <FormHelperText sx={{ color: palette.error.main }}>{discountPriceValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* START DATUM */}
          <FormControl fullWidth sx={{ marginX: 1, mt: 2 }} variant="standard">
            <InputLabel shrink={true} htmlFor="start_date">
              {locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_START_DATE}
            </InputLabel>
            <Input
              id="start_date"
              value={startDate}
              type="date"
              error={isStartDateValidationError}
              onChange={inputChangeListener}
            />
            <FormHelperText sx={{ color: palette.error.main }}>{startDateErrorMessage}</FormHelperText>
          </FormControl>
          {/* END DATUM */}
          <FormControl fullWidth sx={{ marginX: 1, mt: 2, mb: 4 }} variant="standard">
            <InputLabel shrink={true} htmlFor="end_date">
              {locales().MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE}
            </InputLabel>
            <Input
              id="end_date"
              value={endDate}
              type="date"
              error={isEndDateValidationError}
              onChange={inputChangeListener}
            />
            <FormHelperText sx={{ color: palette.error.main }}>{endDateErrorMessage}</FormHelperText>
          </FormControl>
          {/* SPEICHERN */}
          <Button
            onClick={validateInput}
            sx={{
              borderRadius: 0,
              margin: '0 auto',
              ml: 1,
              border: `1px solid ${palette.border.dark}`,
              width: '100%',
              boxShadow: '3px 3px 5px 2px rgba(64,64,64, 0.7)'
            }}
            variant="contained"
            endIcon={<FileDownloadDoneIcon />}
          >
            {locales().GENERAL_SAVE}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
