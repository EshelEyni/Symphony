import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { onLogout } from '../store/user.actions'
import pic from '../assets/img/blank-user.png'
import { userService } from '../services/user.service'


export const AppHeader = () => {
    const loggedInUser = userService.getLoggedinUser()
    const bgColor = useSelector(state => state.appHeaderModule.color)

    const [isUserClicked, setUserClicked] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logout = () => {
        dispatch(onLogout())
        setUserClicked(false)
        navigate('/')
    }

    return (
        <div
            style={{ backgroundColor: bgColor }}
            className='app-header-container full flex'>
            {isUserClicked &&
                <div className='shadow-screen'
                    onClick={() => setUserClicked(false)}
                ></div>
            }
            <div className='app-header-user-links-container flex'>
                {!loggedInUser &&
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

                {loggedInUser && <div className='user-btn-container flex'>
                    <div className='user-profile'
                        onClick={() => setUserClicked(true)}>
                        <img
                            className='profile-pic'
                            src={loggedInUser.imgUrl ? loggedInUser.imgUrl : pic} alt='user-pic' />
                        {loggedInUser.fullname}</div>
                    {isUserClicked &&
                        <div className='user-profile-dropdown flex column'>
                            <NavLink to={'/user-profile/' + loggedInUser._id}
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



