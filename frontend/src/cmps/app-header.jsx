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
        { path: 'download', txt: 'Download' }
    ]

    return (
        <header
            style={{ backgroundColor: headerBgcolor }}
            className='app-header full flex'>
            {isUserClicked &&
                <div className='shadow-screen'
                    onClick={() => setUserClicked(false)}
                ></div>}
            <PaginationBtns />
            <section className='app-header-links-container flex'>

                {/************************* GUEST MODE *************************/}
                {!loggedinUser &&
                    <section className='guest-mode-container flex'>
                        <section className='guest-mode-links-bar flex'>
                            <NavLink to='about' >About</NavLink>
                            <NavLink to='download' >Download</NavLink>
                        </section>
                        <div className='vl'></div>
                        <section className='guest-btn-container flex'>
                            <button onClick={() => navigate('signup')}>Sign up</button>
                            <button onClick={() => navigate('login')}>Log in</button>
                        </section>
                    </section>}

                {/************************* LOGGED IN MODE *************************/}
                {loggedinUser && <section className='user-btn-container flex'>
                    <section
                        className='app-header-profile'
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
                </section>}
            </section>
        </header>
    )
}