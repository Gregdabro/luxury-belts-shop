import { useState } from 'react'
import { LoginForm, RegisterForm } from '@/features/auth'
import styles from './AuthPage.module.scss'

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                {isLogin ? <LoginForm /> : <RegisterForm />}
                <div className={styles.toggle}>
                    <p>
                        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                        <button
                            className={styles.toggleButton}
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Зарегистрироваться' : 'Войти'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}