import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LoginFirstMsg } from './login-first-msg'
import { loginFirstMsgs } from '../services/user.service'
import LikedSongsLogo from '../../src/assets/img/likedsongs.png'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HomeIcon from '@mui/icons-material/Home'
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined'
import ScreenSearchDesktopRoundedIcon from '@mui/icons-material/ScreenSearchDesktopRounded'
import AddBoxIcon from '@mui/icons-material/AddBox'

export const NavList = ({
    loggedinUser,
    isAddStation,
    onAddStation,
    isLoginMsg,
    setIsLoginMsg
}) => {

    const [loginMsgProperties, setLoginMsgProperties] = useState(null)

    const setLoginMsg = (properties) => {
        setLoginMsgProperties(properties)
        setIsLoginMsg(true)
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#92D3C3',
            },
        },
    })

    const setSymbol = (logoUnClicked, logoClicked, txt, txtClassName) => {
        return (
            <ThemeProvider theme={theme}>
                <div className='symbol'>
                    {logoUnClicked}
                </div>
                {logoClicked &&
                    <div className='symbol'>
                        {logoClicked}
                    </div>}
                <span className={txtClassName}>{txt}</span>
            </ThemeProvider>
        )
    }

    const navLinks = [
        {
            path: '/',
            className: 'home-link',
            onClickFunc: null,
            symbol: setSymbol(
                <HomeOutlinedIcon sx={{ fontSize: '30px' }} />,
                <HomeIcon sx={{ fontSize: '30px', }} />,
                'Home', 'text')
        },
        {
            path: 'search',
            className: 'search-link',
            onClickFunc: null,
            symbol: setSymbol(
                <ScreenSearchDesktopOutlinedIcon sx={{ fontSize: '26px' }} />,
                <ScreenSearchDesktopRoundedIcon sx={{ fontSize: '26px' }} />,
                'Search', 'text-search')
        },
        {
            path: 'library',
            className: 'library-link',
            onClickFunc: loggedinUser ? null : () => setLoginMsg(loginFirstMsgs.library),
            symbol: setSymbol(
                <LibraryMusicOutlinedIcon sx={{ fontSize: '26px' }} />,
                <LibraryMusicIcon sx={{ fontSize: '26px' }} />,
                'Library', 'text-library')
        },
        {
            path: null,
            className: 'create-link',
            onClickFunc: loggedinUser ? (isAddStation ? onAddStation : null) : () => setLoginMsg(loginFirstMsgs.createPlaylist),
            symbol: setSymbol(
                <AddBoxIcon sx={{ fontSize: '26px' }} />,
                undefined,
                'Create Playlist', 'text-create')
        },
        {
            path: 'liked',
            className: '',
            onClickFunc: loggedinUser ? null : () => setLoginMsg(loginFirstMsgs.likedSongs),
            symbol: setSymbol(
                <img className='nav-likes-songs-logo' src={LikedSongsLogo} alt='LikedSongsLogo' />,
                undefined,
                'Liked Songs', 'text')
        },
    ]



    return <ul className='nav-list'>
        {navLinks.map((navLink, idx) => {
            const { path, className, onClickFunc, symbol } = navLink
            if (!loggedinUser && idx > 1) {
                return <span key={'nav-link-' + navLink.className} className={className} onClick={onClickFunc}>
                    <li>
                        {symbol}
                    </li>
                </span>
            }

            return (
                <NavLink
                    to={path}
                    end={true}
                    key={'nav-link-' + navLink.className}
                    className={className}
                    onClick={onClickFunc}
                >
                    <li>
                        {symbol}
                    </li>
                </NavLink>
            )
        })}

        {/***************************************** Guest mode properties  *****************************************/}
        {isLoginMsg && <LoginFirstMsg
            loginMsgProperties={loginMsgProperties}
            setIsLoginMsg={setIsLoginMsg}
        />}
    </ul>
}