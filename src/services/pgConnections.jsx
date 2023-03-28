import axios from 'axios'
const baseUrl = 'http://localhost:3002/api/fiscalismia'

let token = null

// const login = async credentials => {
//   const response = await axios.post(baseUrl, credentials)
//   return response.data
// }

// const setToken = newToken => {
//   token = `bearer ${newToken}`
// }

const getTest = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const postTest = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const putTest = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
  return response
}

const deleteTest = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${newObject.id}`, config)
  return response
}

export default {
  // login,
  // setToken,
  getTest,
  postTest,
  putTest,
  deleteTest
}