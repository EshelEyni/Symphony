import React, { useEffect, useState } from 'react'
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
import { Equalizer } from './equalizer'
import { useSelector } from 'react-redux'

export const NavList = ({
    loggedinUser,
    isAddStation,
    onAddStation,
}) => {

    const { currPlaylist, isPlaying } = useSelector(state => state.mediaPlayerModule)
    const [isLikedSongsPlaying, setIsLikedSongsPlaying] = useState(false)
    const [loginMsgProperties, setLoginMsgProperties] = useState(null)
    const [isLoginMsg, setIsLoginMsg] = useState(false)

    useEffect(() => {
        if (!currPlaylist) return
        if (currPlaylist.name === 'Liked Songs' && isPlaying) setIsLikedSongsPlaying(true)
        else setIsLikedSongsPlaying(false)
    }, [currPlaylist, isPlaying])


    const setLoginMsg = (properties) => {
        if (window.innerWidth < 420) properties.top = '-245px'
        setLoginMsgProperties(properties)
        setIsLoginMsg(true)
    }

    const setSymbol = (logoUnClicked, logoClicked, txt) => {
        return (
            <React.Fragment>
                <div className='symbol'>
                    {logoUnClicked}
                </div>
                {logoClicked &&
                    <div className='symbol'>
                        {logoClicked}
                    </div>}
                <span className='symbol-txt'>{txt}</span>
            </React.Fragment>
        )
    }

    const navLinks = [
        {
            path: '/',
            className: 'home-link',
            onClickFunc: null,
            symbol: setSymbol(
                <HomeOutlinedIcon  />,
                <HomeIcon  />,
                'Home')
        },
        {
            path: 'search',
            className: 'search-link',
            onClickFunc: null,
            symbol: setSymbol(
                <ScreenSearchDesktopOutlinedIcon  />,
                <ScreenSearchDesktopRoundedIcon  />,
                'Search')
        },
        {
            path: 'library',
            className: 'library-link',
            onClickFunc: loggedinUser ? null : () => setLoginMsg(loginFirstMsgs.library),
            symbol: setSymbol(
                <LibraryMusicOutlinedIcon  />,
                <LibraryMusicIcon  />,
                'Library')
        },
        {
            path: null,
            className: 'create-playlist-link',
            onClickFunc: loggedinUser ? (isAddStation ? onAddStation : null) : () => setLoginMsg(loginFirstMsgs.createPlaylist),
            symbol: setSymbol(
                <AddBoxIcon />,
                undefined,
                'Create Playlist')
        },
        {
            path: 'liked',
            className: 'liked-songs-link',
            onClickFunc: loggedinUser ? null : () => setLoginMsg(loginFirstMsgs.likedSongs),
            symbol: setSymbol(
                <img className='nav-likes-songs-logo' src={LikedSongsLogo} alt='LikedSongsLogo' />,
                undefined,
                'Liked Songs')
        },
    ]

    return (
        <ul className='nav-list'>
            {navLinks.map((navLink, idx) => {
                const { path, className, onClickFunc, symbol } = navLink
                if (!loggedinUser && idx > 1) {
                    return <span key={'nav-link-' + navLink.className} className={className} onClick={onClickFunc}>
                        <li className='symbol-container'>
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
                        <li className='symbol-container'>
                            {symbol}
                            {(navLink.className === 'liked-songs-link' && isLikedSongsPlaying) && <span
                                className='liked-songs-playing-icon'>
                                <Equalizer />
                            </span>}
                        </li>
                    </NavLink>
                )
            })}

            {isLoginMsg && <LoginFirstMsg
                loginMsgProperties={loginMsgProperties}
                setIsLoginMsg={setIsLoginMsg}
            />}
        </ul>
    )
}