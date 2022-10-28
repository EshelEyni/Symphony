import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { onLogin } from '../store/user.actions.js'

export const Login = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const [isError, setIsError] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [currUser, setCurrUser] = useState({
        username: null,
        password: null
    })

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (loggedinUser) navigate('/')
    }, [loggedinUser])

    const handleChange = ({ target }) => {
        setIsError(false)
        const { value, name } = target
        setCurrUser({ ...currUser, [name]: value })
    }

    const onHandleSubmit = async (ev) => {
        ev.preventDefault()

        try {
            await dispatch(onLogin(currUser))
        }
        catch (err) {
            const error = await err
            console.log('error', error)
            setIsError(true)
        }
    }

    return (
        <section className='login-signup-form-container flex column'>
            <h1>
                Login
            </h1>
            <form
                onSubmit={onHandleSubmit}
                className='login-signup-form flex column'>
                <input
                    className='login-signup-input'
                    type='txt'
                    name='username'
                    placeholder='Username*'
                    onChange={handleChange}
                    onSubmit={onHandleSubmit}
                    required
                />
                <input
                    className='login-signup-input'
                    type='password'
                    name='password'
                    placeholder='Password*'
                    onChange={handleChange}
                    onSubmit={onHandleSubmit}
                    required
                />
                {isError && <p className='error-msg'>Wrong username or password</p>}
                <button
                    onClick={onHandleSubmit}
                    className='login-signup-btn'
                >
                    Login
                </button>
            </form>
        </section>
    )
}