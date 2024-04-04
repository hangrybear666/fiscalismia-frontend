import React from 'react';
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
import TagIcon from '@mui/icons-material/Tag';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ScaleIcon from '@mui/icons-material/Scale';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SelectDropdown from './SelectDropdown';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { resourceProperties as res, investmentInputCategories as selectionCategories } from '../../resources/resource_properties';
import { postNewFoodItem } from '../../services/pgConnections';
import { isNumeric, dateValidation, initializeReactDateInput, stringAlphabeticOnly } from '../../utils/sharedFunctions';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function InputInvestmentDividendTaxesModal( props ) {
  const { palette } = useTheme();
  const { refreshParent } = props
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

  // Inputs
  const [description, setDescription] = React.useState('');
  const [unitPrice, setUnitPrice] = React.useState('');
  const [fees, setFees] = React.useState('');
  const [executionDate, setExecutionDate] = React.useState(initializeReactDateInput(new Date()));
  const [units, setUnits] = React.useState('');
  const [isin, setIsin] = React.useState('');

  // Selection
  const [investmentTypeSelectItems,] = React.useState(selectionCategories.ARRAY_INVESTMENT_TYPE);
  const [selectedInvestmentType, setSelectedInvestmentType] = React.useState(selectionCategories.ARRAY_INVESTMENT_TYPE[0]);
  const [marketplaceSelectItems,] = React.useState(selectionCategories.ARRAY_MARKETPLACE);
  const [selectedMarketplace, setSelectedMarketplace] = React.useState(selectionCategories.ARRAY_MARKETPLACE[0]);
  const [orderTypeArray,] = React.useState(new Array(selectionCategories.ARRAY_ORDER_TYPE));
  const [selectedOrderType, setSelectedOrderType] = React.useState('');
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
    p: 4,
  };

  /**
   * queries DB for food item insertion via REST API
   */
  const saveUserInput = async() => {
    const foodItemObj = {
      foodItem: description.trim(),
      brand: isin.trim(),
      store: selectedInvestmentType,
      mainMacro: selectedMarketplace,
      kcalAmount: Number(units).toFixed(0),
      price: Number(unitPrice).toFixed(2),
      lastUpdate:executionDate,
    }
    const response = await postNewFoodItem(foodItemObj)
    if (response?.results[0]?.id) {
      // this setter is called to force the frontend to update and refetch the data from db
      console.log("SUCCESSFULLY added food item to DB:")// TODO mit Growl und ID ersetzen
      console.log(response.results[0])
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
    // Fees Validation
    if (!isNumeric(fees)) {
      errorPresent = true
      setIsFeeValidationError(true)
      setFeeValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PRICE_VALIDATION_ERROR_MSG)
    } else {
      setIsFeeValidationError(false)
      setFeeValidationErrorMessage('')
    }
    // Price Validation
    if (!isNumeric(unitPrice)) {
      errorPresent = true
      setIsUnitPriceValidationError(true)
      setUnitPriceValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PRICE_VALIDATION_ERROR_MSG)
    } else {
      setIsUnitPriceValidationError(false)
      setUnitPriceValidationErrorMessage('')
    }
    // Generic Date Validation
    if (!dateValidation(executionDate).isValid) {
      errorPresent = true
      setIsDateValidationError(true)
      setDateErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG)
    } else {
      setIsDateValidationError(false)
      setDateErrorMessage('')
    }
    // Units
    if (!isNumeric(units)) {
      errorPresent = true
      setIsUnitsValidationError(true)
      setUnitsValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_UNITS_VALIDATION_ERROR_MSG)
    } else {
      setIsUnitsValidationError(false)
      setUnitsValidationErrorMessage('')
    }
    // ISIN TODO
    if(!isin || isin == '' || isin?.length != 12 || !stringAlphabeticOnly(isin.substring(0,2))) {
      errorPresent = true
      setIsIsinValidationError(true)
      setIsinValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_ISIN_VALIDATION_ERROR_MSG)
    } else {
      setIsIsinValidationError(false)
      setIsinValidationErrorMessage('')
    }
    // description
    if(!description || description == '' || description?.length < 5 || description?.length > 50) {
      errorPresent = true
      setIsDescriptionValidationError(true)
      setDescriptionValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_DESCRIPTION_VALIDATION_ERROR_MSG)
    } else {
      setIsDescriptionValidationError(false)
      setDescriptionValidationErrorMessage('')
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
      case "unit_price":
        setUnitPrice(e.target.value.replace(',','.'))
        break;
      case "fees":
        setFees(e.target.value.replace(',','.'))
        break;
      case "execution_date":
        setExecutionDate(e.target.value)
        break;
      case "units":
        setUnits(e.target.value.replace('.','').replace(',',''))
        break;
      case "description":
        setDescription(e.target.value)
        break;
      case "isin":
        setIsin(e.target.value).replace('-','')
        break;

    }
  }

  const handleInvestmentTypeSelect = (selection) => {
    setSelectedInvestmentType(selection)
  }

  const handleMarketplaceSelect = (selection) => {
    setSelectedMarketplace(selection)
  }

  const handleOrderTypeSelect = (event, newValue) => {
    setSelectedOrderType(newValue)
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
        {res.MINOR_INPUT_FOOD_ITEM_MODAL_OPEN}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
        <Box>
            {orderTypeArray
            ? orderTypeArray.map((parent, index) => {
              return (
              <ToggleButtonGroup
                key={index}
                variant="contained"
                exclusive
                value={selectedOrderType}
                onChange={handleOrderTypeSelect}
                sx={{mt:0.5,mb:1}}
              >
                {parent.map((child, index) => {
                  return (
                  <ToggleButton
                    key={index}
                    size="large"
                    value={child}
                    selected={child===selectedOrderType}
                    sx={{
                      borderRadius:0,
                      paddingX:3.25,
                      '&:hover': {
                        bgcolor: palette.mode === 'light' ? palette.grey[600] : palette.grey[600],
                        color: palette.common.white,
                      },
                      '&.Mui-selected:hover': {
                        bgcolor: palette.mode === 'light' ? palette.grey[800] : palette.grey[500],
                      },
                      '&.Mui-selected': {
                        bgcolor: palette.mode === 'light' ? palette.grey[900] : palette.grey[400],
                        color: palette.mode === 'light' ? palette.common.white : palette.common.black,
                        boxShadow: palette.mode === 'light' ? `0px 0px 4px 2px ${palette.grey[700]}` : '',
                        transition: 'box-shadow 0.2s linear 0s'},
                      '&.Mui-disabled' : {
                        color: palette.text.disabled
                      },
                    }}
                  >
                    {child}
                  </ToggleButton>
                  )
                }
                )}
              </ToggleButtonGroup>
              )
            })
              : null}
          </Box>
          {/* INVESTMENT TYPE */}
          {investmentTypeSelectItems
          ? <Box sx={{ ml:1, mr:0, mt:2 }}>
              <SelectDropdown
                sx={{ m:1 }}
                selectLabel={res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_INVESTMENT_TYPE_SELECT}
                selectItems={investmentTypeSelectItems}
                selectedValue={selectedInvestmentType}
                handleSelect={handleInvestmentTypeSelect}
              />
            </Box>
          : null}
          {/* MARKETPLACE SELECTION */}
          {marketplaceSelectItems
          ? <Box sx={{ ml:1, mr:0, mt:2.5, mb:1.5 }}>
              <SelectDropdown
                selectLabel={res.MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_MARKETPLACE_SELECT}
                selectItems={marketplaceSelectItems}
                selectedValue={selectedMarketplace}
                handleSelect={handleMarketplaceSelect}
              />
            </Box>
          : null}
          {/* DESCRIPTION */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="description">{res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_DESCRIPTION}</InputLabel>
            <Input
              id="description"
              value={description}
              onChange={inputChangeListener}
              type="text"
              error={isDescriptionValidationError}
              startAdornment={<InputAdornment position="start"><DriveFileRenameOutlineIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{descriptionValidationErrorMessage}</FormHelperText>
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
              startAdornment={<InputAdornment position="start"><QueryStatsIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{isinValidationErrorMessage}</FormHelperText>
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
              startAdornment={<InputAdornment position="start"><TagIcon/></InputAdornment>}
              />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{unitsValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* UNIT PRICE */}
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="unit_price">{res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_UNIT_PRICE}</InputLabel>
            <Input
              id="unit_price"
              value={unitPrice}
              onChange={inputChangeListener}
              type="text"
              error={isUnitPriceValidationError}
              startAdornment={<InputAdornment position="start"><EuroSymbolIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{unitPriceValidationErrorMessage}</FormHelperText>
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
              startAdornment={<InputAdornment position="start"><EuroSymbolIcon/></InputAdornment>}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)'}}>{feeValidationErrorMessage}</FormHelperText>
          </FormControl>
          {/* EXECUTION DATE */}
          <FormControl fullWidth sx={{ marginX: 1, mt:2 }} variant="standard">
            <InputLabel htmlFor="execution_date">{res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_INPUT_EXECUTION_DATE}</InputLabel>
            <Input
              id="execution_date"
              value={executionDate}
              onChange={inputChangeListener}
              type="date"
              error={isDateValidationError}
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