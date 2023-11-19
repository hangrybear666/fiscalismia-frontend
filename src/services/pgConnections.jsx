import axios from 'axios'
import { serverConfig, localStorageKeys } from '../resources/resource_properties';
const baseUrl = serverConfig.API_BASE_URL
export class FileSizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileSizeError';
  }
}

let token = window.localStorage.getItem(localStorageKeys.token)

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

export const getUserSpecificSettings = async (username) => {
  if (!token) {
    setToken()
  }
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
  if (!token) {
    setToken()
  }
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
 * Returns fixed costs valid for a specific provided date in the format (yyyy-mm-dd) // TODO
 * @returns Object containing a results array with all fixed costs from the db
 * @route /api/fiscalismia/fixed_costs
 */
export const getAllFixedCosts = async () => {
  if (!token) {
    setToken()
  }
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
 * Returns food prices and discounts valid at the time of request (current_date)
 * @returns Object containing a results array with all food prices and discounts from the db
 * @route /api/fiscalismia/food_prices_and_discounts
 */
export const getAllFoodPricesAndDiscounts = async () => {
  if (!token) {
    setToken()
  }
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
  if (!token) {
    setToken()
  }
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
/**
 * User Upload of images such as jpg/webp/png requiring:
 * - <input type="file" /> within a <Button component='label'/>
 * @param {*} postContent
 * @returns
 */
export const postFoodItemImg = async (event, foodItemId) => {
  if (!token) {
    setToken()
  }
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
  if (!token) {
    setToken()
  }
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
/** receives TSV as input from admin
 * MANDATORY HEADER STRUCTURE:
 * category, description,  monthly_interval,  billed_cost, monthly_cost,  effective_date,  expiration_date
 * @param {*} fixedCostsTsvInput
 * @returns INSERT INTO statements for manual validation and loading of db table
 * or ERROR data
 */
export const postFixedCostTsv = async fixedCostsTsvInput => {
  if (!token) {
    setToken()
  }
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

/**
 * receives TSV as input from admin
 * MANDATORY HEADER STRUCTURE:
 * food_item, brand, store,  main_macro, kcal_amount, weight, price, last_update
 * @param {*} foodItemTsvInput
 * @returns INSERT INTO statements for manual validation and loading of db table
 * or ERROR data
 */
export const postAllFoodItems = async foodItemTsvInput => {
  if (!token) {
    setToken()
  }
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

/**
 * performs db insertion of provided object
 * @param {*} foodItemObj with fields: foodItem, brand, store, mainMacro, kcalAmount, weight, price, lastUpdate
 * @returns dimension_key of inserted object or ERROR
 */
export const postNewFoodItem = async foodItemObj => {
  if (!token) {
    setToken()
  }
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

/**
 * deletes server side images and removes filepath entry from db
 * @param {*} filepath
 * @returns
 */
export const deleteFoodItemImg = async id => {
  if (!token) {
    setToken()
  }
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

const getTest = async () => {
  if (!token) {
    setToken()
  }
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
  if (!token) {
    setToken()
  }
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
  if (!token) {
    setToken()
  }
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
  if (!token) {
    setToken()
  }
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