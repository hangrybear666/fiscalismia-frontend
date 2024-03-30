
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
 * 
 * @param {*} results 
 * @returns 
 */
export function getUniqueEffectiveDates(results) {
    return Array.from(new Set(results.map(e => e.effective_date))).sort((a,b) => a<b) // SORT Desc to initialize with current value at index 0
  }