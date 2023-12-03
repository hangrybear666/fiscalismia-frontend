import axios from 'axios'
import { serverConfig, localStorageKeys } from '../resources/resource_properties';
import { invalidateSession, useAuth } from '../services/userAuthentication';
import { useNavigate } from 'react-router-dom';
const baseUrl = serverConfig.API_BASE_URL
export class FileSizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileSizeError';
  }
}


/***
 *      ___  _   _ _____ _   _  _____ _   _ _____ _____ _____   ___ _____ _____ _____ _   _
 *     / _ \| | | |_   _| | | ||  ___| \ | |_   _|_   _/  __ \ / _ \_   _|_   _|  _  | \ | |
 *    / /_\ \ | | | | | | |_| || |__ |  \| | | |   | | | /  \// /_\ \| |   | | | | | |  \| |
 *    |  _  | | | | | | |  _  ||  __|| . ` | | |   | | | |    |  _  || |   | | | | | | . ` |
 *    | | | | |_| | | | | | | || |___| |\  | | |  _| |_| \__/\| | | || |  _| |_\ \_/ / |\  |
 *    \_| |_/\___/  \_/ \_| |_/\____/\_| \_/ \_/  \___/ \____/\_| |_/\_/  \___/ \___/\_| \_/
 */

// set from local storage variable on each request, to avoid caching of local variable in this file between logouts
let token;

const setToken = () => {
  token = window.localStorage.getItem(localStorageKeys.token)
}

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/um/login`, credentials)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * 0) WARNING: THE BACKEND CURRENTLY CONTAINS A WHITELIST OF USERNAMES TO LIMIT ACCESS
 * 1) performs DB INSERTION into um_users
 * 2) initializes um_user_settings such as mode (light) and palette(default)
 * @param {*} username
 * @param {*} email
 * @param {*} password
 * @returns username if successful OR error otherwise
 */
export const createUserCredentials = async (username, email, password) => {
  try {
    const accountObject = {
      username:username,
      email:email,
      password:password
    }
    const response = await axios.post(`${baseUrl}/um/credentials`, accountObject )
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/***
 *     _____  _____ _____      ___   _      _
 *    |  __ \|  ___|_   _|    / _ \ | |    | |
 *    | |  \/| |__   | |     / /_\ \| |    | |
 *    | | __ |  __|  | |     |  _  || |    | |
 *    | |_\ \| |___  | |     | | | || |____| |____
 *     \____/\____/  \_/     \_| |_/\_____/\_____/
 */

/**
 * @returns Object containing a results array with all fixed costs from the db
 * @route /api/fiscalismia/fixed_costs
 */
export const getAllFixedCosts = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/fixed_costs`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns Object containing a results array with all sensitivities within variable expenses in db
 * @route /api/fiscalismia/sensitivity
 */
export const getAllVariableExpenseSensitivities = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/sensitivity`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns Object containing a results array with all stores within variable expenses in db
 * @route /api/fiscalismia/store
 */
export const getAllVariableExpenseStores = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/store`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns Object containing a results array with all categories within variable expenses in db
 * @route /api/fiscalismia/category
 */
export const getAllVariableExpenseCategories = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/category`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns Object containing a results array with all variable Expenses from the db
 * @route /api/fiscalismia/variable_expenses
 */
export const getAllVariableExpenses = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/variable_expenses`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * @returns Object containing a results array with all fixed income data from the db
 * @route /api/fiscalismia/fixed_costs
 */
export const getAllFixedIncome = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/fixed_income`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns food prices and discounts valid at the time of request (current_date)
 * @returns Object containing a results array with all food prices and discounts from the db
 * @route /api/fiscalismia/food_prices_and_discounts
 */
export const getAllFoodPricesAndDiscounts = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/food_prices_and_discounts`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns discounted foods valid at the time of request (current_date)
 * @returns Object containing a results array with all active discounts from the db
 * @route /api/fiscalismia/discounted_foods_current
 */
export const getCurrentFoodDiscounts = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/discounted_foods_current`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}
/***
 *     _____  _____ _____     ___________ _____ _____ ___________ _____ _____
 *    |  __ \|  ___|_   _|   /  ___| ___ \  ___/  __ \_   _|  ___|_   _/  __ \
 *    | |  \/| |__   | |     \ `--.| |_/ / |__ | /  \/ | | | |_    | | | /  \/
 *    | | __ |  __|  | |      `--. \  __/|  __|| |     | | |  _|   | | | |
 *    | |_\ \| |___  | |     /\__/ / |   | |___| \__/\_| |_| |    _| |_| \__/\
 *     \____/\____/  \_/     \____/\_|   \____/ \____/\___/\_|    \___/ \____/
 */

export const getUserSpecificSettings = async (username) => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/um/settings/${username}`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns fixed costs valid for a specific provided date in the format (yyyy-mm-dd) // TODO
 * @param {*} validDate Date currently required to be in english date format (yyyy-mm-dd)
 * @returns Object containing a results array with all fixed costs valid at provided date from the db
 * @route /api/fiscalismia/fixed_costs/valid/:date
 */
 export const getFixedCostsByEffectiveDate = async (validDate) => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/fixed_costs/valid/${validDate}`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns variable expenses dependent on provided category description as string
 * @param {*} category category description string
 * @returns Object containing a results array with all variable expenses with provided category
 * @route /api/fiscalismia/variable_expenses/category/:category
 */
export const getVariableExpenseByCategory = async (category) => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/variable_expenses/category/${category}`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns fixed income valid for a specific provided date in the format (yyyy-mm-dd) // TODO
 * @param {*} validDate Date currently required to be in english date format (yyyy-mm-dd)
 * @returns Object containing a results array with all fixed income data valid at provided date from the db
 * @route /api/fiscalismia/fixed_income/valid/:date
 */
export const getFixedIncomeByEffectiveDate = async (validDate) => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${baseUrl}/fixed_income/valid/${validDate}`, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/***
 *    ______ _____ _____ _____
 *    | ___ \  _  /  ___|_   _|
 *    | |_/ / | | \ `--.  | |
 *    |  __/| | | |`--. \ | |
 *    | |   \ \_/ /\__/ / | |
 *    \_|    \___/\____/  \_/
 */

/**
 * performs db UPSERT statement for um_user_settings for:
 * SET setting_value='value'
 * WHERE user_id = (subselect loginUserName) AND setting_key='key'
 * @param {*} loginUserName SELECT id FROM public.um_users WHERE username = 'loginUserName'
 * @param {*} key setting_key column of um_user_settings
 * @param {*} value setting_value column of um_user_settings
 * @returns username associated with updated row
 */
export const postUpdatedUserSettings = async (loginUserName, key, value) => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}`, }
    }
    const userSettingObj = {
      username: loginUserName,
      settingKey: key,
      settingValue: value
    }
    const response = await axios.post(`${baseUrl}/um/settings`, userSettingObj , config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * User Upload of images such as jpg/webp/png requiring:
 * - <input type="file" /> within a <Button component='label'/>
 * @param {*} postContent
 * @returns
 */
export const postFoodItemImg = async (event, foodItemId) => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data' }
    }
    let file = event.target.files[0];
    if (file?.size > 1 * 1024 * 1024) {
      return new FileSizeError('File size is limited to 1MB.')
    }
    if (file?.type !== 'image/png' && file?.type !== 'image/jpeg' && file?.type !== 'image/webp') {
      return new axios.AxiosError('Images must be uploaded as either png, jpeg or webp!');
    }
    const formData = new FormData();
    formData.append('foodItemImg', file);
    formData.append("id", foodItemId);
    const response = await axios.post(`${baseUrl}/upload/food_item_img`, formData, config)
    return response
  } catch (error) {
    console.error(error);
  }
}
/**
 * performs db insertion of provided object
 * @param {*} foodItemDiscountObj with fields: id,price,startDate,endDate
 * @returns
 */
export const postFoodItemDiscount = async foodItemDiscountObj => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'application/json',}
    }
    const response = await axios.post(`${baseUrl}/upload/food_item_discount`, foodItemDiscountObj, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/**
 * performs db insertion of provided object
 * @param {*} foodItemObj with fields: foodItem, brand, store, mainMacro, kcalAmount, weight, price, lastUpdate
 * @returns dimension_key of inserted object or ERROR
 */
export const postNewFoodItem = async foodItemObj => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'application/json',}
    }
    const response = await axios.post(`${baseUrl}/upload/food_item`, foodItemObj, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

/***
 *    ______ _____ _      _____ _____ _____
 *    |  _  \  ___| |    |  ___|_   _|  ___|
 *    | | | | |__ | |    | |__   | | | |__
 *    | | | |  __|| |    |  __|  | | |  __|
 *    | |/ /| |___| |____| |___  | | | |___
 *    |___/ \____/\_____/\____/  \_/ \____/
 *
 */

/**
 * deletes server side images and removes filepath entry from db
 * @param {*} filepath
 * @returns
 */
export const deleteFoodItemImg = async id => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.delete(`${baseUrl}/public/img/uploads/${id}`, config)
    return response
  } catch (error) {
    console.error(error);
  }
}

/***
 *     _   _____________  ___ _____ _____
 *    | | | | ___ \  _  \/ _ \_   _|  ___|
 *    | | | | |_/ / | | / /_\ \| | | |__
 *    | | | |  __/| | | |  _  || | |  __|
 *    | |_| | |   | |/ /| | | || | | |___
 *     \___/\_|   |___/ \_| |_/\_/ \____/
 */


/***
 *     _____     _        _____                            _           _    _   _       _
 *    |_   _|   | |      /  ___|                          | |         | |  | | | |     | |
 *      | | __ _| |__    \ `--.  ___ _ __   __ _ _ __ __ _| |_ ___  __| |  | | | | __ _| |_   _  ___
 *      | |/ _` | '_ \    `--. \/ _ \ '_ \ / _` | '__/ _` | __/ _ \/ _` |  | | | |/ _` | | | | |/ _ \
 *      | | (_| | |_) |  /\__/ /  __/ |_) | (_| | | | (_| | ||  __/ (_| |  \ \_/ / (_| | | |_| |  __/
 *      \_/\__,_|_.__/   \____/ \___| .__/ \__,_|_|  \__,_|\__\___|\__,_|   \___/ \__,_|_|\__,_|\___|
 *                                  | |
 *                                  |_|
 */
/** receives TSV as input from admin
 * MANDATORY HEADER STRUCTURE:
 * category, description,  monthly_interval,  billed_cost, monthly_cost,  effective_date,  expiration_date
 * @param {*} fixedCostsTsvInput
 * @returns INSERT INTO statements for manual validation and loading of db table
 * or ERROR data
 */
export const postFixedCostTsv = async fixedCostsTsvInput => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'text/plain',}
    }
    const response = await axios.post(`${baseUrl}/texttsv/fixed_costs`, fixedCostsTsvInput, config)
    return response
  } catch (error) {
    return error
  }
}
/** receives TSV as input from admin
 * MANDATORY HEADER STRUCTURE:
 * description,  category,  store cost,  date,  is_planned,  contains_indulgence, sensitivities
 * @param {*} variableExpensesTsvInput
 * @returns INSERT INTO statements for manual validation and loading of db table
 * or ERROR data
 */
export const postVariableExpensesTsv = async variableExpensesTsvInput => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'text/plain',}
    }
    const response = await axios.post(`${baseUrl}/texttsv/variable_expenses`, variableExpensesTsvInput, config)
    return response
  } catch (error) {
    return error
  }
}


/** receives TSV as input from admin
 * MANDATORY HEADER STRUCTURE:
 * description,	type,	monthly_interval,	value,	effective_date,	expiration_date
 * @param {*} fixedIncomeTsvInput
 * @returns INSERT INTO statements for manual validation and loading of db table
 * or ERROR data
 */
export const postFixedIncomeTsv = async fixedIncomeTsvInput => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'text/plain',}
    }
    const response = await axios.post(`${baseUrl}/texttsv/fixed_income`, fixedIncomeTsvInput, config)
    return response
  } catch (error) {
    return error
  }
}

/**
 * receives TSV as input from admin
 * MANDATORY HEADER STRUCTURE:
 * food_item, brand, store,  main_macro, kcal_amount, weight, price, last_update
 * @param {*} foodItemTsvInput
 * @returns INSERT INTO statements for manual validation and loading of db table
 * or ERROR data
 */
export const postAllFoodItemTsv = async foodItemTsvInput => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'text/plain',}
    }
    const response = await axios.post(`${baseUrl}/texttsv/new_food_items`, foodItemTsvInput, config)
    return response
  } catch (error) {
    return error
  }
}

/***
 *     _____ _____ _____ _____
 *    |_   _|  ___/  ___|_   _|
 *      | | | |__ \ `--.  | |
 *      | | |  __| `--. \ | |
 *      | | | |___/\__/ / | |
 *      \_/ \____/\____/  \_/
 */

const getTest = async () => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

const postTest = async newObject => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'application/json',}
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

const putTest = async newObject => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
    return response
  } catch (error) {
    console.error(error);
  }
}

const deleteTest = async id => {
  setToken()
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response
  } catch (error) {
    console.error(error);
  }
}

export default {
  getTest,
  postTest,
  putTest,
  deleteTest
}