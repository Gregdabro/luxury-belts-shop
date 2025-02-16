import { create } from 'zustand'
import { STORAGE_TOKEN_KEY } from '@/shared/config/api.config'

export const useUserStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    login: (userData) => {
        const { accessToken, user } = userData
        localStorage.setItem(STORAGE_TOKEN_KEY, accessToken)
        set({ user, error: null })
    },

    logout: () => {
        localStorage.removeItem(STORAGE_TOKEN_KEY)
        set({ user: null, error: null })
    }
}))