import { loadUsers, onSignup } from '../store/user.actions.js'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const Signup = () => {
    const users = useSelector(state => state.userModule.users)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        dispatch(loadUsers())
    }, [])

    let [user, setUser] = useState({
        username: null,
        fullname: null,
        password: null,
    })

    const onHandleSubmit = (ev) => {
        ev.preventDefault()
        if (users.find(currUser => currUser.username === user.username)) {
            return alert('user name already exits!')
        }
        dispatch(onSignup(user))
        navigate('/')
    }

    const handleChange = ({ target }) => {
        const { value, name } = target
        setUser({ ...user, [name]: value })
    }

    return (
        <div>
            <h1>
                Signup
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
                    type="txt"
                    name="fullname"
                    className="input-signup"
                    placeholder="Full name*"
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
                    Signup
                </button>
            </form>
        </div>
    )
}