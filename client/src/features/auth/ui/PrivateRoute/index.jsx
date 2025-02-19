import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/entities/user'

export const PrivateRoute = ({ children }) => {
    const { user } = useUserStore()
    
    if (!user) {
        return <Navigate to="/auth" replace />
    }

    return children
}