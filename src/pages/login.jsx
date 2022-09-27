
import { onLogin } from '../store/user.actions.js'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { userService } from '../services/user.service.js'

export const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    let [user, setUser] = useState({
        username: null,
        password: null
    })

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
    }, [])

    const handleChange = ({ target }) => {
        const { value, name } = target
        setUser({ ...user, [name]: value })
    }
    
    const onHandleSubmit = async (ev) => {
        ev.preventDefault()
        dispatch(onLogin(user))
        const isLogin = await userService.login(user)
        if (isLogin) navigate('/')
    }

    return (
        <div className='login-form-container'>
            <h1>
                Login
            </h1>
            <form
                onSubmit={onHandleSubmit}
                className="form-signup flex column">
                <input
                    type="txt"
                    name="username"
                    className="input-signup"
                    placeholder="Username*"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    className="input-signup"
                    placeholder="Password*"
                    onChange={handleChange}
                    required
                />

                <button
                    className="btn-signup"
                >
                    Login
                </button>
            </form>
        </div>
    )
}