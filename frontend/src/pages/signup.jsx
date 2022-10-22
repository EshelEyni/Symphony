import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadUsers, onSignup, setUserMsg } from '../store/user.actions.js'
import { userService } from '../services/user.service.js'

export const Signup = () => {
    const { users } = useSelector(state => state.userModule)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!users.length) dispatch(loadUsers())

    }, [])

    let [currUser, setCurrUser] = useState({
        username: null,
        fullname: null,
        password: null,
    })

    const onHandleSubmit = (ev) => {
        ev.preventDefault()

        if (userService.checkUsername(users, currUser.username)) {
            dispatch(setUserMsg('user name already exits!'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
            return
        }
        dispatch(onSignup(currUser))
        navigate('/')
    }

    const handleChange = ({ target }) => {
        const { value, name } = target
        setCurrUser({ ...currUser, [name]: value })
    }

    return (
        <section className='login-signup-form-container flex column'>
            <h1>
                Signup
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
                    required
                />
                <input
                    className='login-signup-input'
                    type='txt'
                    name='fullname'
                    placeholder='Fullname*'
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
                <button className='login-signup-btn'>
                    Signup
                </button>
            </form>
        </section>
    )
}