
import { resourceProperties as res} from '../resources/resource_properties';

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