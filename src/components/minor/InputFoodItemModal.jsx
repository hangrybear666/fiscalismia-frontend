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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ScaleIcon from '@mui/icons-material/Scale';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SelectDropdown from './SelectDropdown';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { resourceProperties as res, foodItemInputCategories as selectionCategories } from '../../resources/resource_properties';
import { postNewFoodItem } from '../../services/pgConnections';


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

export default function InputFoodItemModal( props ) {
  const { setAddedItemId } = props
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
  const [lastUpdateDate, setLastUpdateDate] = React.useState('');
  // Selection
  const [storeSelectItems,] = React.useState(selectionCategories.ARRAY_STORES);
  const [selectedStore, setSelectedStore] = React.useState('');
  const [macroSelectItems,] = React.useState(selectionCategories.ARRAY_MACROS);
  const [selectedMacro, setSelectedMacro] = React.useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**
   * queries DB for food item insertion via REST API
   */
  const saveUserInput = async() => {
    const foodItemObj = {
      foodItem: foodItem.trim(),
      brand: brand.trim(),
      store: selectedStore,
      mainMacro: selectedMacro,
      kcalAmount: kcalAmount,
      weight: weight,
      price:price,
      lastUpdate:lastUpdateDate,
    }
    const response = await postNewFoodItem(foodItemObj)
    if (response?.results[0]?.dimension_key) {
      // this setter is called to force the frontend to update and refetch the data from db
      console.log("SUCCESSFULLY added food item to DB:")
      console.log(foodItemObj)
      setOpen(false)
      // to refresh parent's table based on added food item after DB insertion
      setAddedItemId(response?.results[0].id)
    } else {
      // TODO User Notification
      console.error(response)
    }
  }

 const validateInput = (e) => {
   e.preventDefault();
    // food item
    if(!foodItem || foodItem == '' || foodItem?.length < 5) {
      setIsFoodItemValidationError(true)
      setFoodItemValidationErrorMessage(res.MINOR_INPUT_FOOD_ITEM_MODAL_FOOD_ITEM_VALIDATION_ERROR_MSG)
    } else {
      setIsFoodItemValidationError(false)
      setFoodItemValidationErrorMessage('')
    }
    // brand TODO
    if(!brand || brand == '' || brand?.length < 4) {
      setIsBrandValidationError(true)
      setBrandValidationErrorMessage(res.MINOR_INPUT_FOOD_ITEM_MODAL_BRAND_VALIDATION_ERROR_MSG)
    } else {
      setIsBrandValidationError(false)
      setBrandValidationErrorMessage('')
    }
    // Kcal Amount
    if (!isNumeric(kcalAmount)) {
      setIskcalAmountValidationError(true)
      setKcalAmountValidationErrorMessage(res.MINOR_INPUT_FOOD_ITEM_MODAL_KCAL_AMOUNT_VALIDATION_ERROR_MSG)
    } else {
      setIskcalAmountValidationError(false)
      setKcalAmountValidationErrorMessage('')
    }
    // weight
    if (!isNumeric(weight)) {
      setIsWeightValidationError(true)
      setWeightValidationErrorMessage(res.MINOR_INPUT_FOOD_ITEM_MODAL_WEIGHT_VALIDATION_ERROR_MSG)
    } else {
      setIsWeightValidationError(false)
      setWeightValidationErrorMessage('')
    }
    // Price Validation
    if (!isNumeric(price)) {
      setIsPriceValidationError(true)
      setPriceValidationErrorMessage(res.MINOR_INPUT_FOOD_ITEM_MODAL_PRICE_VALIDATION_ERROR_MSG)
    } else {
      setIsPriceValidationError(false)
      setPriceValidationErrorMessage('')
    }
    // Generic Date Validation
    if (!dateValidation(lastUpdateDate).isValid) {
      setIsDateValidationError(true)
      setDateErrorMessage(res.MINOR_INPUT_FOOD_ITEM_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG)
    } else {
      setIsDateValidationError(false)
      setDateErrorMessage('')
    }
    if (isPriceValidationError || isDateValidationError || isBrandValidationError || isWeightValidationError || isFoodItemValidationError || iskcalAmountValidationError) {
      // Errors present => return
      return
    } else {
      // Errors missing => save to db
      saveUserInput()
    }
  }

  const inputChangeListener = (e) => {
    switch (e.target.id) {
      case "food_item":
        setFoodItem(e.target.value)
        break;
      case "brand":
        setBrand(e.target.value)
        break;
      case "kcal_amount":
        setKcalAmount(e.target.value.replace('k','').replace('c','').replace('a','').replace('l',''))
        break;
      case "weight":
        setWeight(e.target.value.replace('g','').replace('.','').replace(',',''))
        break;
      case "price":
        setPrice(e.target.value.replace(',','.'))
        break;
      case "last_update":
        setLastUpdateDate(e.target.value)
        break;
    }
  }

  const handleStoreSelect = (selection) => {
    setSelectedStore(selection)
  }

  const handleMacroSelect = (selection) => {
    setSelectedMacro(selection)
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
        {res.MINOR_INPUT_FOOD_ITEM_MODAL_OPEN}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          {/* FOOD ITEM */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="food_item">{res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_FOOD_ITEM}</InputLabel>
            <Input
              id="food_item"
              value={foodItem}
              onChange={inputChangeListener}
              type="text"
              error={isFoodItemValidationError}
              startAdornment={<InputAdornment position="start"><RestaurantIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{foodItemValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* BRAND */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="brand">{res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_BRAND}</InputLabel>
            <Input
              id="brand"
              value={brand}
              onChange={inputChangeListener}
              type="text"
              error={isBrandValidationError}
              startAdornment={<InputAdornment position="start"><WorkspacePremiumIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{brandValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* STORE */}
          {storeSelectItems
          ? <Box sx={{ ml:1, mr:0, mt:2 }}>
              <SelectDropdown
                sx={{ m:1 }}
                defaultValue={res.ALL}
                selectLabel={res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_STORE}
                selectItems={storeSelectItems}
                selectedValue={selectedStore}
                handleSelect={handleStoreSelect}
              />
            </Box>
          : null}
          {/* PRICE */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="price">{res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_PRICE}</InputLabel>
            <Input
              id="price"
              value={price}
              onChange={inputChangeListener}
              type="text"
              error={isPriceValidationError}
              startAdornment={<InputAdornment position="start"><EuroSymbolIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{priceValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* WEIGHT */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="weight">{res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_WEIGHT}</InputLabel>
            <Input
              id="weight"
              value={weight}
              onChange={inputChangeListener}
              type="text"
              error={isWeightValidationError}
              startAdornment={<InputAdornment position="start"><ScaleIcon/></InputAdornment>}
              />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{weightValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* KCAL AMOUNT */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="kcal_amount">{res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_KCAL_AMOUNT}</InputLabel>
            <Input
              id="kcal_amount"
              value={kcalAmount}
              onChange={inputChangeListener}
              type="text"
              error={iskcalAmountValidationError}
              startAdornment={<InputAdornment position="start"><LocalFireDepartmentIcon/></InputAdornment>}
              />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{kcalAmountValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* MACRO CATEGORY */}
          {macroSelectItems
          ? <Box sx={{ ml:1, mr:0, mt:2.5, mb:1.5 }}>
              <SelectDropdown
                defaultValue={res.ALL}
                selectLabel={res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_MAIN_MACRO}
                selectItems={macroSelectItems}
                selectedValue={selectedMacro}
                handleSelect={handleMacroSelect}
              />
            </Box>
          : null}
          {/* DATE OF LAST UPDATE */}
          <FormControl fullWidth sx={{ marginX: 1, mt:2 }} variant="standard">
            <InputLabel shrink={true} htmlFor="last_update">{res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_LAST_UPDATE}</InputLabel>
            <Input
              id="last_update"
              value={lastUpdateDate}
              type="date"
              error={isDateValidationError}
              onChange={inputChangeListener}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{dateErrorMessage}</FormHelperText>
          </FormControl>
          {/* SPEICHERN */}
          <Button
            onClick={validateInput}
            sx={{ borderRadius:0,
                  margin:'0 auto',
                  mt:2,
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