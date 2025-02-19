import { RouterProvider } from './providers/RouterProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider />
        </QueryClientProvider>
    )
}