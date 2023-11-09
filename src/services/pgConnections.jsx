import axios from 'axios'
import { serverConfig } from '../resources/resource_properties';
const baseUrl = serverConfig.API_BASE_URL
export class FileSizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileSizeError';
  }
}

let token = window.localStorage.getItem('jwt-token')

const setToken = () => {
  token = window.localStorage.getItem('jwt-token')
}

const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/um/login`, credentials)
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

export const postNewFoodItem = async foodItemDiscountObj => {
  if (!token) {
    setToken()
  }
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'application/json',}
    }
    const response = await axios.post(`${baseUrl}/upload/food_item`, foodItemDiscountObj, config)
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
  login,
  getTest,
  postTest,
  putTest,
  deleteTest
}