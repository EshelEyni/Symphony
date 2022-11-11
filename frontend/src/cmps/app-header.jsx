import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { onLogout } from '../store/user.actions'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded'
import { PaginationBtns } from './pagination-btns'

export const AppHeader = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { headerBgcolor } = useSelector(state => state.appHeaderModule)
    const [userToDisplay, setUserToDisplay] = useState(loggedinUser)
    const [isUserClicked, setUserClicked] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        setUserToDisplay(loggedinUser)
    }, [loggedinUser])

    const logout = async () => {
        await dispatch(onLogout())
        setUserClicked(false)
        navigate('/')
    }

    const dropdownNavLinks = [
        { path: 'profile/' + loggedinUser?._id, txt: 'Profile' },
        { path: 'about', txt: 'About' },
    ]

    return (
        <header
            style={{ backgroundColor: headerBgcolor }}
            className='app-header'>
            {isUserClicked &&
                <div className='main-screen'
                    onClick={() => setUserClicked(false)}
                />}
            <main className='app-header-main-container flex'>
                <PaginationBtns />
 
                {/************************* GUEST MODE *************************/}
                {!loggedinUser &&
                    <div className='guest-mode-container '>
                        <NavLink to='about' >About</NavLink>
                        <div className='vl'></div>
                        <NavLink to='/signup'>Sign up</NavLink>
                        <NavLink to='/login'>Log in</NavLink>
                    </div>}

                {/************************* LOGGED IN MODE *************************/}
                {loggedinUser && <div className='user-mode-container flex'>
                    <section
                        className='profile-details'
                        title={userToDisplay?.username}
                        onClick={() => setUserClicked(!isUserClicked)}>
                        <img
                            className='profile-pic'
                            src={userToDisplay?.imgUrl} alt='user-pic' />
                        <p className='flex'>
                            {userToDisplay?.username}
                            {!isUserClicked && <ArrowDropDownRoundedIcon />}
                            {isUserClicked && <ArrowDropUpRoundedIcon />}
                        </p>
                    </section>

                    {isUserClicked &&
                        <section className='app-header-profile-dropdown flex column'>
                            {dropdownNavLinks.map(navLink => <NavLink
                                key={'headr-nav-link-' + navLink.txt}
                                to={navLink.path}
                                onClick={() => setUserClicked(false)}
                            >{navLink.txt}</NavLink>)}
                            <div
                                className='logout-link'
                                onClick={logout} >Logout</div>
                        </section>}
                </div>}
            </main>
        </header>
    )
}