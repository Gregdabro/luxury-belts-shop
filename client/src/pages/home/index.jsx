import { useUserStore } from '@/entities/user'
import styles from './HomePage.module.scss'

export const HomePage = () => {
    const { user, logout } = useUserStore()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Ошибка при выходе:', error)
        }
    }

    return (
        <div className={styles.container}>
            <h1>Добро пожаловать, {user?.email}!</h1>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Выйти
            </button>
        </div>
    )
}