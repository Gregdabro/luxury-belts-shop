import { axiosInstance } from './instance'
import { STORAGE_TOKEN_KEY } from '@/shared/config/api.config'

export const setupInterceptors = () => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(STORAGE_TOKEN_KEY)
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    // Попытка обновить токен
                    const response = await axiosInstance.post('/auth/refresh', {}, {
                        withCredentials: true
                    })
                    
                    const newToken = response.data.accessToken
                    localStorage.setItem(STORAGE_TOKEN_KEY, newToken)
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    // Если не удалось обновить токен, очищаем хранилище
                    localStorage.removeItem(STORAGE_TOKEN_KEY)
                    // Можно добавить редирект на страницу входа
                    return Promise.reject(refreshError)
                }
            }
            return Promise.reject(error)
        }
    )
}