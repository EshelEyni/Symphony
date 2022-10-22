import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadUsers, onLogin, setUserMsg } from '../store/user.actions.js'
import { userService } from '../services/user.service.js'

export const Login = () => {
    const { user, users } = useSelector(state => state.userModule)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [currUser, setCurrUser] = useState({
        username: null,
        password: null
    })

    useEffect(() => {
        if (!users.length) dispatch(loadUsers())
        if (user) navigate('/')
    }, [user])

    const handleChange = ({ target }) => {
        const { value, name } = target
        setCurrUser({ ...currUser, [name]: value })
    }

    const onHandleSubmit = async (ev) => {
        ev.preventDefault()
        if (!userService.checkUsername(users, currUser.username)) {
            dispatch(setUserMsg('User name is incorrect!'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
            return
        }
        try {
            await dispatch(onLogin(currUser))
        }
        catch (err) {
            const error = await err
            console.log('error', error)
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