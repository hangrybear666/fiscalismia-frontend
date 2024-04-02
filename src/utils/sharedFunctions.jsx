
import { resourceProperties as res} from '../resources/resource_properties';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import Tooltip from '@mui/material/Tooltip';

/**
 * 
 * @param {*} header 
 * @param {*} amount 
 * @param {*} subtitle 
 * @param {*} details 
 * @param {*} icon 
 * @param {*} img 
 * @returns
 */
export function constructContentCardObject(header, amount, subtitle, details, icon, img) { // TODO img
  let turnus = subtitle === '1.00' ? res.INTERVAL_MONTHLY
    : subtitle === '3.00' ? res.INTERVAL_QUARTERLY
    : subtitle === '6.00' ? res.INTERVAL_HALFYEARLY
    : subtitle === '12.00' ? res.INTERVAL_YEARLY
    : `alle ${subtitle} Monate`
  const contentCardObj =
    {
    header: header.trim(),
    amount: `${Math.round(amount)}${res.CURRENCY_EURO}`,
    subtitle: turnus,
    details: details,
    img: img ? img : `https://source.unsplash.com/random/?money&${Math.floor(Math.random() * 100)}`,
    icon: icon
  }
  if (img === res.NO_IMG) {
    contentCardObj.img = null
  }
  return contentCardObj
}

/**
 * extracts all uniqure effective dates of a single dataset
 * @param {*} singleDataSet required
 * @returns sorted array of effective dates in the format 'yyyy-mm-dd'
 * It doesn't matter how it is sorted, as long as it is. This is because both
 * income and fixed costs call this method and subsequently are passed to the
 * chart component via incomeDataSets that both require to be sorted in the same way.
 */
export function getUniqueEffectiveDates(singleDataSet) {
  return Array.from(new Set(singleDataSet.map(e => e.effective_date))).sort((a,b) => a<b) // SORT Desc to initialize with current value at index 0
}


/**
 * extracts all uniqure effective dates from two result sets from the db
 * @param {*} firstDataset
 * @param {*} secondDataset
 * @returns DESC sorted array of effective dates in the format 'yyyy-mm-dd'
 */
export function getCombinedUniqueEffectiveDates(firstDataset, secondDataset) {
  if (firstDataset && secondDataset) {
    const incomeSet = new Set(firstDataset.map(e => e.effective_date))
    const costsSet = new Set(secondDataset.map(e => e.effective_date))
    return Array.from(new Set([...incomeSet,...costsSet])).sort((a,b) => a<b) // desc
  }
}


/**
 * Formats Date into a React Component including a Quarter Chip and custom Date String
 * @param {*} props value = date in format 2024-01-15
 * @returns Date formatted as "Q1 2. Jan 24"
 */
export const DateCellFormatter = (props) => {
  const extractedDate = props.value ? new Date(props.value) : null
  if (extractedDate && extractedDate !== null) {
    const day = String(extractedDate.getDay());
    const monthShort = extractedDate.toLocaleString('default', { month: 'short' });
    const yearShort = String(extractedDate.getFullYear()).substring(2,4);
    const dateString = `${day}. ${monthShort} ${yearShort}`
    const monthIdx = extractedDate.getMonth()
    let quarter, quarterColor
    if (monthIdx >= 0 && monthIdx < 3) {
      quarter = 1
      quarterColor = 'primary'
    } else if (monthIdx >= 3 && monthIdx < 6) {
      quarter = 2
      quarterColor = 'secondary'
    } else if (monthIdx >= 6 && monthIdx < 9) {
      quarter = 3
      quarterColor = 'tertiary'
    } else {
      quarter = 4
      quarterColor = 'success'
    }
    return (
      <>
        <Chip
          label={`Q${quarter}`}
          variant="outlined"
          size="large"
          sx={{
            border: 0,
            fontWeight: 500,
            fontSize: '110%',
            marginBottom:0.5}}
          color={quarterColor} />
        <span>
          {dateString}
        </span>
      </>
    )
  } else {
    return props.value
  }
}

/**
 * To use a Tooltip with custom React/HTML content just pass the content into the title Tag of HtmlTooltip
 * <HtmlTooltip title={<React.Fragment></React.Fragment>}>
 * </HtmlTooltip>
 */
export const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    maxWidth: 250,
    border: `2px solid ${theme.palette.mode === 'light' ? theme.palette.border.dark : theme.palette.border.light}`,
  },
}));