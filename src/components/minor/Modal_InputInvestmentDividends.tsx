import React, { useEffect } from 'react';
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
import { resourceProperties as res } from '../../resources/resource_properties';
import { postDividends } from '../../services/pgConnections';
import { isNumeric, dateValidation, initializeReactDateInput } from '../../utils/sharedFunctions';
import { DividendsRelatedInvestmentsAndTaxes, TwelveCharacterString } from '../../types/custom/customTypes';

interface InputInvestmentDividendsModalProps {
  refreshParent: React.Dispatch<React.SetStateAction<number>>;
  isinSelection: TwelveCharacterString[];
  allInvestments: any;
}

/**
 *
 * @param props
 */
export default function InputInvestmentDividendsModal(props: InputInvestmentDividendsModalProps) {
  const { palette } = useTheme();
  const { refreshParent, isinSelection, allInvestments } = props;
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
  const [pctTaxed, setPctTaxed] = React.useState(Number(100.0).toFixed(2));

  // Selection
  const [isinSelectItems, setIsinSelectItems] = React.useState<TwelveCharacterString[]>(isinSelection);
  const [selectedIsin, setSelectedIsin] = React.useState<string>('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ON PAGE LOAD
  useEffect(() => {
    // after allInvestments change (after e.g. investment addition) refresh isin dropdown
    setIsinSelectItems(isinSelection);
  }, [allInvestments]);

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
   * WARNING: complicated logic for partial sales
   * When dividends are added, we want to assign them only to relevant stocks (which are still OWNED)
   * Principle applied is First in First Out (FiFo) so stocks are sold off in chronological order of purchase (older ones first)
   * - Calculates running averages for unit price of owned investments
   * - Calculates which investments have been fully sold
   * - Calculates which investments are still owned fully
   * - Calculates which investment is only owned partially and the remaining units
   * Returns remaining units and investment ids related to dividend payment
   * @param dividendDate
   * @param allInvestments
   */
  const extractRelatedInvestmentsOfDividend = (
    dividendDate: Date,
    allInvestments: any
  ): {
    investmentId: number;
    remainingUnits: number;
  }[] => {
    const investmentIdsAndUnits: {
      investmentId: number;
      remainingUnits: number;
    }[] = [];
    const filteredInvestments = allInvestments
      .filter((e: any) => e.isin === selectedIsin)
      .filter((e: any) => new Date(e.execution_date) < new Date(dividendDate));
    if (
      filteredInvestments.map((e: any) => e.execution_type).includes(res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY)
    ) {
      /**
       * applicable past investments include type 'sell'
       * - calculate running average price of owned stocks
       * - remove any investments fully sold to identify which are still owned for dividend aggregate
       */
      let ownedUnits = 0;
      let averageUnitPrice = 0;
      let ownedInvestmentIds: number[] = [];
      let partiallySoldInvestment: any;
      let fullySoldInvestmentIds: number[] = [];
      filteredInvestments.sort((a: any, b: any) => new Date(a.execution_date) > new Date(b.execution_date)); // Sort by ascending execution_date - earliest first
      filteredInvestments.forEach((e: any, _index: number, investments: any[]) => {
        if (e.execution_type === res.INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY) {
          //   __
          //  |__) |  | \ /
          //  |__) \__/  |
          if (partiallySoldInvestment) {
            // calculate new average price from prior owned positions
            let newAvgPrice = 0;
            let currentOwnedUnits = 0;
            investments
              .filter((e) => ownedInvestmentIds.includes(e.id))
              .forEach((e) => {
                if (e.id === partiallySoldInvestment.id) {
                  newAvgPrice =
                    (newAvgPrice * currentOwnedUnits +
                      partiallySoldInvestment.remainingUnits * partiallySoldInvestment.price_per_unit) /
                    (currentOwnedUnits + partiallySoldInvestment.remainingUnits);
                  currentOwnedUnits += partiallySoldInvestment.remainingUnits;
                } else {
                  newAvgPrice =
                    (newAvgPrice * currentOwnedUnits + e.price_per_unit * e.units) /
                    (currentOwnedUnits + Number(e.units));
                }
              });
            // console.log("newAvgPrice")
            // console.log(newAvgPrice)
            // console.log("currentOwnedUnits")
            // console.log(currentOwnedUnits)
            averageUnitPrice = newAvgPrice;
          }
          ownedInvestmentIds.push(e.id);
          averageUnitPrice =
            ownedUnits === 0
              ? Number(e.price_per_unit) // first invocation or owned Units were at 0 after sale --> avg Unit price is identical to current buy
              : (averageUnitPrice * ownedUnits + e.price_per_unit * e.units) / (ownedUnits + Number(e.units)); // subsequent invocation. calculate running average
          // console.log("ownedUnits " + ownedUnits + " + " + Number(e.units) + " for " + e.price_per_unit + "€")
          // console.log("averageUnitPrice " + averageUnitPrice)
          ownedUnits += Number(e.units);
        } else if (e.execution_type === res.INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY) {
          //  __   ___
          // /__` |__  |    |
          // .__/ |___ |___ |___
          ownedUnits -= Number(e.units);
          if (ownedUnits < 0) {
            // TODO LOG CRITICAL ERROR TO FRONTEND
            console.error('WRONG DATA IN DB. OWNED UNITS NEGATIVE? FIX ASAP.');
            throw new Error('WRONG DATA IN DB. OWNED UNITS NEGATIVE? FIX ASAP.');
          } else if (ownedUnits === 0) {
            // SOLD ALL OWNED UNITS
            fullySoldInvestmentIds = Array.from(ownedInvestmentIds);
            ownedInvestmentIds = [];
            partiallySoldInvestment = null;
            averageUnitPrice = 0;
          } else if (ownedUnits > 0) {
            console.info('you are making my life hard by partially selling off stock');
            //   __        __  ___                 __             ___
            //  |__)  /\  |__)  |  |  /\  |       /__`  /\  |    |__
            //  |    /~~\ |  \  |  | /~~\ |___    .__/ /~~\ |___ |___
            const partialSaleDate = new Date(e.execution_date);
            let partialSaleUnits = Number(e.units);
            const currentInvestments = investments.filter(
              (e) =>
                e.execution_type === res.INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY && // only purchases
                new Date(e.execution_date) < partialSaleDate && // only before sale date
                !fullySoldInvestmentIds.includes(e.id)
            ); // exclude any fully sold investments
            currentInvestments.every((current) => {
              // every is like forEach but it breaks looping when callback receives a false value
              if (Number(current.units) <= partialSaleUnits) {
                if (partiallySoldInvestment && current.id === partiallySoldInvestment.id) {
                  console.info(
                    'you are making my life even harder by selling off partially from multiple stock positions'
                  );
                  partialSaleUnits -= partiallySoldInvestment.remainingUnits;
                  partiallySoldInvestment = [];
                } else {
                  partialSaleUnits -= Number(current.units);
                }
                fullySoldInvestmentIds.push(current.id);
                // WARNING: splice returns the removed element so don't assign this to a new array!
                ownedInvestmentIds.splice(ownedInvestmentIds.indexOf(current.id), 1); // Splice with parameter 1 removes 1 element at indexOf current.id
              } else if (Number(current.units) > partialSaleUnits) {
                // partially sold investment position
                partiallySoldInvestment = { remainingUnits: Number(current.units) - partialSaleUnits, ...current };
                partialSaleUnits = 0;
                return false; // breaks out of every loop
              }
              return true; // continues every loop
            });
          }
        }
      });
      // console.log("owned units at " + dividendDate + " is: " + ownedUnits)
      // console.log("averageUnitPrice  at " + dividendDate + " is: " + averageUnitPrice)
      // console.log("owned investment ids: " + ownedInvestmentIds)
      // console.log("fully sold investment ids: " + fullySoldInvestmentIds)
      // console.log("partiallySoldInvestment: ")
      // console.log(partiallySoldInvestment)
      //   __   __        __  ___  __        __  ___     __   ___ ___       __           __   __        ___  __  ___
      //  /  ` /  \ |\ | /__`  |  |__) |  | /  `  |     |__) |__   |  |  | |__) |\ |    /  \ |__)    | |__  /  `  |
      //  \__, \__/ | \| .__/  |  |  \ \__/ \__,  |     |  \ |___  |  \__/ |  \ | \|    \__/ |__) \__/ |___ \__,  |
      if (partiallySoldInvestment) {
        // push partially owned investment id and remaining units
        investmentIdsAndUnits.push({
          investmentId: partiallySoldInvestment.id,
          remainingUnits: partiallySoldInvestment.remainingUnits
        });
        // WARNING: splice returns the removed element so don't assign this to a new array!
        ownedInvestmentIds.splice(ownedInvestmentIds.indexOf(partiallySoldInvestment.id), 1); // Splice with parameter 1 removes 1 element at indexOf id
        // push fully owned investments with all units
        filteredInvestments
          .filter((e: any) => ownedInvestmentIds.includes(e.id))
          .forEach((e: any) => {
            investmentIdsAndUnits.push({ investmentId: e.id, remainingUnits: e.units });
          });
      }
    } else {
      // all applicable past investments are of type 'buy' --> aggregate
      filteredInvestments.forEach((e: any) => {
        investmentIdsAndUnits.push({ investmentId: e.id, remainingUnits: e.units });
      });
    }
    // console.log("investmentIdsAndUnits")
    // console.log(investmentIdsAndUnits)
    return investmentIdsAndUnits;
  };

  /**
   * queries DB for dividend and taxes insertion via REST API
   */
  const saveUserInput = async () => {
    const dividendsObject: DividendsRelatedInvestmentsAndTaxes = {
      isin: selectedIsin as TwelveCharacterString,
      dividendAmount: parseFloat(Number(dividendAmount).toFixed(2)),
      dividendDate: new Date(dividendDate),
      pctOfProfitTaxed: parseFloat(Number(pctTaxed).toFixed(2)),
      profitAmount: parseFloat(Number(dividendAmount).toFixed(2)),
      investmentIdsAndRemainingUnits: extractRelatedInvestmentsOfDividend(new Date(dividendDate), allInvestments)
    };
    const response = await postDividends(dividendsObject);
    if (response?.results[0]?.id) {
      // this setter is called to force the frontend to update and refetch the data from db
      console.log('SUCCESSFULLY added investments to DB:'); // TODO mit Growl und ID ersetzen
      console.log(response.results[0]);
      if (response?.taxesResults[0]?.id) {
        console.log('SUCCESSFULLY added investment_taxes to DB:'); // TODO mit Growl und ID ersetzen
        console.log(response.taxesResults[0]);
      }
      if (response?.bridgeResults[0]?.id) {
        console.log('SUCCESSFULLY added aggregated investments of dividend to DB:'); // TODO mit Growl und ID ersetzen
        console.log(response.bridgeResults);
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
    console.log(!/^[a-zA-Z]{2}$/.test(selectedIsin.substring(0, 2)));
    let errorPresent = false;
    // Dividend Amount
    if (!isNumeric(dividendAmount) || parseInt(dividendAmount) < 0) {
      errorPresent = true;
      setIsDividendAmountValidationError(true);
      setDividendAmountValidationErrorMessage(res.MINOR_INPUT_DIVIDEND_MODAL_DIVIDEND_AMOUNT_VALIDATION_ERROR_MSG);
    } else {
      setIsDividendAmountValidationError(false);
      setDividendAmountValidationErrorMessage('');
    }
    // Generic Date Validation
    if (!dateValidation(dividendDate).isValid) {
      errorPresent = true;
      setIsDateValidationError(true);
      setDateErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG);
    } else {
      setIsDateValidationError(false);
      setDateErrorMessage('');
    }
    // Pct Taxed Validation
    if (
      !isNumeric(pctTaxed) ||
      parseFloat(parseFloat(pctTaxed).toFixed(2)) > 100.0 ||
      parseFloat(parseFloat(pctTaxed).toFixed(2)) < 0
    ) {
      errorPresent = true;
      setIsPctTaxedValidationError(true);
      setPctTaxedValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_PCT_TAXED_VALIDATION_ERROR_MSG);
    } else {
      setIsPctTaxedValidationError(false);
      setPctTaxedValidationErrorMessage('');
    }
    // Selected ISIN
    if (!selectedIsin || selectedIsin?.length < 12 || !/^[a-zA-Z]{2}$/.test(selectedIsin?.substring(0, 2))) {
      errorPresent = true;
      setIsSelectedIsinValidationError(true);
      setSelectedIsinValidationErrorMessage(res.MINOR_INPUT_INVESTMENT_DIVIDEND_TAXES_MODAL_ISIN_VALIDATION_ERROR_MSG);
    } else {
      setIsSelectedIsinValidationError(false);
      setSelectedIsinValidationErrorMessage('');
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
      case 'dividend_date':
        setDividendDate(e.target.value);
        break;
      case 'dividend_amount':
        setDividendAmount(e.target.value.replace(',', '.'));
        break;
      case 'pct_taxed':
        setPctTaxed(e.target.value.replace(',', '.'));
        break;
    }
  };

  const handleIsinSelect = (selection: string) => {
    setSelectedIsin(selection);
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
        {res.MINOR_INPUT_DIVIDEND_MODAL_OPEN_BUTTON}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* ISIN SELECTION */}
          {isinSelectItems ? (
            <Box sx={{ ml: 1, mr: 0, mt: 2.5 }}>
              <SelectDropdown
                selectLabel={res.MINOR_INPUT_DIVIDEND_MODAL_INPUT_ISIN_SELECT}
                selectItems={isinSelectItems}
                selectedValue={selectedIsin}
                handleSelect={handleIsinSelect}
              />
              <FormControl
                fullWidth
                sx={{ mt: 0.2, display: isSelectedIsinValidationError ? 'inline' : 'none' }}
                variant="standard"
              >
                <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>
                  {selectedIsinValidationErrorMessage}
                </FormHelperText>
              </FormControl>
            </Box>
          ) : null}
          {/* DIVIDEND DATE */}
          <FormControl fullWidth sx={{ marginX: 1, mt: 2 }} variant="standard">
            <InputLabel htmlFor="dividend_date">{res.MINOR_INPUT_DIVIDEND_MODAL_INPUT_DIVIDEND_DATE}</InputLabel>
            <Input
              id="dividend_date"
              value={dividendDate}
              onChange={inputChangeListener}
              type="date"
              error={isDateValidationError}
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>{dateErrorMessage}</FormHelperText>
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
              startAdornment={
                <InputAdornment position="start">
                  <EuroSymbolIcon />
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: 'rgba(211,47,47,1.0)' }}>
              {dividendAmountValidationErrorMessage}
            </FormHelperText>
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
