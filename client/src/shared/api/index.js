import { axiosInstance } from './axios/instance'
import { setupInterceptors } from './axios/interceptors'

// Инициализация перехватчиков
setupInterceptors()

export { axiosInstance }