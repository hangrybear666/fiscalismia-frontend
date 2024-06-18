import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ScaleIcon from '@mui/icons-material/Scale';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SelectDropdown from './SelectDropdown';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { foodItemInputCategories as selectionCategories } from '../../resources/resource_properties';
import { postNewFoodItem } from '../../services/pgConnections';
import { isNumeric, dateValidation, initializeReactDateInput, toastOptions } from '../../utils/sharedFunctions';
import { locales } from '../../utils/localeConfiguration';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

interface InputFoodItemModalProps {
  refreshParent: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Dialog Modal to insert new food items into db.
 * Has a bunch of validation to ensure data consistency and applicable error messaging.
 * @param {InputFoodItemModalProps} props
 * @returns
 */
export default function InputFoodItemModal(props: InputFoodItemModalProps) {
  const { palette } = useTheme();
  const { refreshParent } = props;
  const [open, setOpen] = React.useState(false);
  // Validation
  const [isFoodItemValidationError, setIsFoodItemValidationError] = React.useState(false);
  const [isBrandValidationError, setIsBrandValidationError] = React.useState(false);
  const [iskcalAmountValidationError, setIskcalAmountValidationError] = React.useState(false);
  const [isWeightValidationError, setIsWeightValidationError] = React.useState(false);
  const [isPriceValidationError, setIsPriceValidationError] = React.useState(false);
  const [isDateValidationError, setIsDateValidationError] = React.useState(false);
  const [priceValidationErrorMessage, setPriceValidationErrorMessage] = React.useState('');
  const [weightValidationErrorMessage, setWeightValidationErrorMessage] = React.useState('');
  const [brandValidationErrorMessage, setBrandValidationErrorMessage] = React.useState('');
  const [kcalAmountValidationErrorMessage, setKcalAmountValidationErrorMessage] = React.useState('');
  const [foodItemValidationErrorMessage, setFoodItemValidationErrorMessage] = React.useState('');
  const [dateErrorMessage, setDateErrorMessage] = React.useState('');
  // Inputs
  const [foodItem, setFoodItem] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [kcalAmount, setKcalAmount] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [lastUpdateDate, setLastUpdateDate] = React.useState(initializeReactDateInput(new Date()));
  // Selection
  const [storeSelectItems] = React.useState(selectionCategories.ARRAY_STORES);
  const [selectedStore, setSelectedStore] = React.useState('');
  const [macroSelectItems] = React.useState(selectionCategories.ARRAY_MACROS);
  const [selectedMacro, setSelectedMacro] = React.useState('');
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
   * queries DB for food item insertion via REST API
   */
  const saveUserInput = async () => {
    const foodItemObj = {
      food_item: foodItem.trim(),
      brand: brand.trim(),
      store: selectedStore,
      main_macro: selectedMacro,
      kcal_amount: parseInt(kcalAmount),
      weight: parseInt(weight),
      price: parseFloat(Number(price).toFixed(2)),
      last_update: new Date(lastUpdateDate)
    };
    const response = await postNewFoodItem(foodItemObj);
    if (response?.results[0]?.id) {
      toast.success(locales().NOTIFICATIONS_FOOD_ITEM_INSERTED_SUCCESSFULLY(response.results[0].id), toastOptions);
      // this setter is called to force the frontend to update and refetch the data from db
      setOpen(false);
      // to refresh parent's table based on added food item after DB insertion
      refreshParent(response.results[0].id);
    } else {
      toast.error(locales().NOTIFICATIONS_FOOD_ITEM_INSERTED_ERROR, toastOptions);
    }
  };

  const validateInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let errorPresent = false;
    // food item
    if (!foodItem || foodItem == '' || foodItem?.length < 5) {
      errorPresent = true;
      setIsFoodItemValidationError(true);
      setFoodItemValidationErrorMessage(locales().MINOR_INPUT_FOOD_ITEM_MODAL_FOOD_ITEM_VALIDATION_ERROR_MSG);
    } else {
      setIsFoodItemValidationError(false);
      setFoodItemValidationErrorMessage('');
    }
    // brand TODO
    if (!brand || brand == '' || brand?.length < 4) {
      errorPresent = true;
      setIsBrandValidationError(true);
      setBrandValidationErrorMessage(locales().MINOR_INPUT_FOOD_ITEM_MODAL_BRAND_VALIDATION_ERROR_MSG);
    } else {
      setIsBrandValidationError(false);
      setBrandValidationErrorMessage('');
    }
    // Kcal Amount
    if (!isNumeric(kcalAmount)) {
      errorPresent = true;
      setIskcalAmountValidationError(true);
      setKcalAmountValidationErrorMessage(locales().MINOR_INPUT_FOOD_ITEM_MODAL_KCAL_AMOUNT_VALIDATION_ERROR_MSG);
    } else {
      setIskcalAmountValidationError(false);
      setKcalAmountValidationErrorMessage('');
    }
    // weight
    if (!isNumeric(weight)) {
      errorPresent = true;
      setIsWeightValidationError(true);
      setWeightValidationErrorMessage(locales().MINOR_INPUT_FOOD_ITEM_MODAL_WEIGHT_VALIDATION_ERROR_MSG);
    } else {
      setIsWeightValidationError(false);
      setWeightValidationErrorMessage('');
    }
    // Price Validation
    if (!isNumeric(price)) {
      errorPresent = true;
      setIsPriceValidationError(true);
      setPriceValidationErrorMessage(locales().MINOR_INPUT_FOOD_ITEM_MODAL_PRICE_VALIDATION_ERROR_MSG);
    } else {
      setIsPriceValidationError(false);
      setPriceValidationErrorMessage('');
    }
    // Generic Date Validation
    if (!dateValidation(lastUpdateDate).isValid) {
      errorPresent = true;
      setIsDateValidationError(true);
      setDateErrorMessage(locales().MINOR_INPUT_FOOD_ITEM_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG);
    } else {
      setIsDateValidationError(false);
      setDateErrorMessage('');
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
      case 'food_item':
        setFoodItem(e.target.value);
        break;
      case 'brand':
        setBrand(e.target.value);
        break;
      case 'kcal_amount':
        setKcalAmount(
          e.target.value
            .replace('k', '')
            .replace('c', '')
            .replace('a', '')
            .replace('l', '')
            .replace('.', '')
            .replace(',', '')
        );
        break;
      case 'weight':
        setWeight(e.target.value.replace('g', '').replace('.', '').replace(',', ''));
        break;
      case 'price':
        setPrice(e.target.value.replace(',', '.'));
        break;
      case 'last_update':
        setLastUpdateDate(e.target.value);
        break;
    }
  };

  const handleStoreSelect = (selection: string) => {
    setSelectedStore(selection);
  };

  const handleMacroSelect = (selection: string) => {
    setSelectedMacro(selection);
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
        {locales().MINOR_INPUT_FOOD_ITEM_MODAL_OPEN}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* FOOD ITEM */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="food_item">{locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_FOOD_ITEM}</InputLabel>
            <Input
              id="food_item"
              value={foodItem}
              onChange={inputChangeListener}
              type="text"
              error={isFoodItemValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <RestaurantIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: palette.error.main }}>{foodItemValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* BRAND */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="brand">{locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_BRAND}</InputLabel>
            <Input
              id="brand"
              value={brand}
              onChange={inputChangeListener}
              type="text"
              error={isBrandValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <WorkspacePremiumIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: palette.error.main }}>{brandValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* STORE */}
          {storeSelectItems ? (
            <Box sx={{ ml: 1, mr: 0, mt: 2 }}>
              <SelectDropdown
                selectLabel={locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_STORE}
                selectItems={storeSelectItems}
                selectedValue={selectedStore}
                handleSelect={handleStoreSelect}
              />
            </Box>
          ) : null}
          {/* PRICE */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="price">{locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_PRICE}</InputLabel>
            <Input
              id="price"
              value={price}
              onChange={inputChangeListener}
              type="text"
              error={isPriceValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <EuroSymbolIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: palette.error.main }}>{priceValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* WEIGHT */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="weight">{locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_WEIGHT}</InputLabel>
            <Input
              id="weight"
              value={weight}
              onChange={inputChangeListener}
              type="text"
              error={isWeightValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <ScaleIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: palette.error.main }}>{weightValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* KCAL AMOUNT */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="kcal_amount">{locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_KCAL_AMOUNT}</InputLabel>
            <Input
              id="kcal_amount"
              value={kcalAmount}
              onChange={inputChangeListener}
              type="text"
              error={iskcalAmountValidationError}
              startAdornment={
                <InputAdornment position="start">
                  <LocalFireDepartmentIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: palette.error.main }}>{kcalAmountValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* MACRO CATEGORY */}
          {macroSelectItems ? (
            <Box sx={{ ml: 1, mr: 0, mt: 2.5, mb: 1.5 }}>
              <SelectDropdown
                selectLabel={locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_MAIN_MACRO}
                selectItems={macroSelectItems}
                selectedValue={selectedMacro}
                handleSelect={handleMacroSelect}
              />
            </Box>
          ) : null}
          {/* DATE OF LAST UPDATE */}
          <FormControl fullWidth sx={{ marginX: 1, mt: 2 }} variant="standard">
            <InputLabel shrink={true} htmlFor="last_update">
              {locales().MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_LAST_UPDATE}
            </InputLabel>
            <Input
              id="last_update"
              value={lastUpdateDate}
              type="date"
              error={isDateValidationError}
              onChange={inputChangeListener}
            />
            <FormHelperText sx={{ color: palette.error.main }}>{dateErrorMessage}</FormHelperText>
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
            {locales().GENERAL_SAVE}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
