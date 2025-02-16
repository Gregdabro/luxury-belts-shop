import { createBrowserRouter, RouterProvider as Router } from 'react-router-dom'
import { AuthPage } from '@/pages/auth/AuthPage'
import { PrivateRoute } from '@/features/auth/ui/PrivateRoute'
import { HomePage } from '@/pages/home'

const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthPage />
    },
    {
        path: '/',
        element: (
            <PrivateRoute>
                <HomePage />
            </PrivateRoute>
        )
    }
])

export const RouterProvider = () => {
    return <Router router={router} />
}