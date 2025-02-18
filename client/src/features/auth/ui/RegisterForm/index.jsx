import { useState } from 'react'
import { useUserStore } from '@/entities/user'
import { AuthService } from '../../api/authService'
import styles from './RegisterForm.module.scss'

export const RegisterForm = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const { login, setLoading } = useUserStore()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Пароли не совпадают')
            return
        }

        setLoading(true)

        try {
            const data = await AuthService.register(name, email, password)
            login(data)
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Регистрация</h2>

            <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            
            <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                    Пароль
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>
                    Подтвердите пароль
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>

            {error && (
                <div className={styles.error}>{error}</div>
            )}

            <button type="submit" className={styles.button}>
                Зарегистрироваться
            </button>
        </form>
    )
}