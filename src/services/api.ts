import axios from 'axios'
import { API_CONFIG } from '@/constants/api'

const api = axios.create({
  baseURL: API_CONFIG.BACKEND.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const wompiApi = axios.create({
  baseURL: API_CONFIG.WOMPI.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_CONFIG.WOMPI.PRIVATE_KEY}`,
  },
})

export default api
