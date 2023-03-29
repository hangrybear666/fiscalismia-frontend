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
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch (error) {
    console.error(error);
  }
}

const postTest = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  console.log("axios received:")
  console.log(newObject)
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

const deleteTest = async id => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
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