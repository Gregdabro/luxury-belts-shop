import { axiosInstance } from './instance'
import { STORAGE_TOKEN_KEY, AUTH_ENDPOINTS } from '@/shared/config/api.config'

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
        (config) => {
            return config
        }, async (error) => {
            const originalRequest = error.config

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const response = await axiosInstance.get(AUTH_ENDPOINTS.REFRESH, {
                        withCredentials: true
                    })
                    
                    const newToken = response.data.accessToken
                    localStorage.setItem(STORAGE_TOKEN_KEY, newToken)
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return axiosInstance(originalRequest)
                } catch (error) {
                    console.log("Refresh token failed", error)
                    localStorage.removeItem(STORAGE_TOKEN_KEY)
                    window.location.href = '/auth'
                    return Promise.reject(error)
                }
            }
            return Promise.reject(error)
        }
    )
}