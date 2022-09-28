import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { onLogout } from '../store/user.actions'
import pic from '../assets/img/blank-user.png'

export const AppHeader = () => {
    const user = useSelector(state => state.userModule.user)
    const bgColor = useSelector(state => state.appHeaderModule.color)

    const [isUserClicked, setUserClicked] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    console.log('isUserClicked', isUserClicked)

    const logout = () => {
        dispatch(onLogout())
        setUserClicked(false)
        navigate('/')
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#92D3C3',
            },
        },
    })

    return (
        <div
            style={{ backgroundColor: bgColor }}
            className='app-header-container full flex'>
            {/* {isUserClicked &&
                <div className='shadow-screen'
                    onClick={() => setUserClicked(false)}
                ></div>
            } */}

            <div className='app-header-user-links-container flex'>
                {!user &&
                    <div className='guest-mode-container flex'>
                        <div className='guest-mode-links-bar flex'>
                            <NavLink to='/about' >About</NavLink>
                            <NavLink to='/download' >Download</NavLink>
                        </div>|
                        <div className='guest-btn-container flex'>
                            <NavLink to='/signup' >Sign up</NavLink>
                            <NavLink to='/login' >Log in</NavLink>
                        </div>
                    </div>}

                {user && <div className='user-btn-container flex'>
                    <div className='user-profile'
                        onClick={() => setUserClicked(true)}>
                        <img
                            className='profile-pic'
                            src={user.imgUrl ? user.imgUrl : pic} alt='user-pic' />
                        {user.fullname}</div>
                    {isUserClicked &&
                        <div className='user-profile-dropdown flex column'>
                            <NavLink to={'/user-profile/' + user._id}
                                onClick={() => setUserClicked(false)}
                                >Profile</NavLink>
                            <NavLink to='/about'
                                onClick={() => setUserClicked(false)}>About</NavLink>
                            <NavLink to='/download'
                                onClick={() => setUserClicked(false)}>Download</NavLink>
                            <div
                                className='logout-link'
                                onClick={logout} >Logout</div>
                        </div>}
                </div>}
            </div>
        </div>
    )
}



