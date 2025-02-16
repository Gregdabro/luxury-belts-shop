import { axiosInstance } from '@/shared/api'
import { AUTH_ENDPOINTS } from '@/shared/config/api.config'

export const AuthService = {
    async login(name, email, password) {
        const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
            name,
            email,
            password
        })

        return response.data
    },

    async register(name, email, password) {
        const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
            name,
            email,
            password
        })
        return response.data
    },

    async logout() {
        const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT)
        return response.data
    },

    async checkAuth() {
        const response = await axiosInstance.get(AUTH_ENDPOINTS.CHECK)
        return response.data
    }
}