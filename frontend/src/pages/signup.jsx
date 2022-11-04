import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LoginSignupForm } from '../cmps/login-signup-form.jsx'
import { onSignup } from '../store/user.actions.js'

export const Signup = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const [isError, setIsError] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (loggedinUser) navigate('/')
    }, [loggedinUser])

    let [currUser, setCurrUser] = useState({
        username: null,
        fullname: null,
        password: null,
    })

    const onHandleSubmit = async (ev) => {
        ev.preventDefault()
        try {
            await dispatch(onSignup(currUser))
        }
        catch (err) {
            const error = await err
            console.log('error', error)
            setIsError(true)
        }

    }

    const handleChange = ({ target }) => {
        setIsError(false)
        const { value, name } = target
        setCurrUser({ ...currUser, [name]: value })
    }

    return (
        <section className='login-signup-form-container flex column'>
            <h1>Signup</h1>
            <LoginSignupForm
                onHandleSubmit={onHandleSubmit}
                handleChange={handleChange}
                isError={isError}
                errorTxt={'User name already exists'}
                link={{ path: '/login', txt: 'Already have an acount? Login!' }}
                isSignup={true}
            />
        </section>
    )
}