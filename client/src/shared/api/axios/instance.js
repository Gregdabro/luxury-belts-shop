import axios from 'axios'
import { API_URL } from '@/shared/config/api.config'

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Нужно для работы с cookie
    headers: {
        'Content-Type': 'application/json'
    }
})