import axios from 'axios'

export const useFetch = () => {
  const instance = axios.create({
    baseURL: 'https://viacep.com.br/ws'
  })

  const getCepInfo = async (cep) => {
    const response = await instance.get(`${cep}/json`)
    return response.data
  }

  return { getCepInfo }
}