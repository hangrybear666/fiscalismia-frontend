import axios from 'axios'
const baseUrl = 'http://localhost:3002/api/fiscalismia'

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
 * @returns Object containing a results array with all matched rows from the Database
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
      headers: { Authorization: `Bearer ${token}` }
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
  getFixedCostsByEffectiveDate,
  getTest,
  postTest,
  putTest,
  deleteTest
}