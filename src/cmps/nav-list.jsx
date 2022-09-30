import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HomeIcon from '@mui/icons-material/Home'
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined';
import ScreenSearchDesktopRoundedIcon from '@mui/icons-material/ScreenSearchDesktopRounded';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import AddBoxIcon from '@mui/icons-material/AddBox'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { LoginMsg } from './login-msg'
import LikedSongsLogo from '../../src/assets/img/likedsongs.png'

export const NavList = ({ user, isLoginMsg, isAddStation, onAddStation, setIsLoginMsg }) => {

    // Support Home icom switch - exact does not apply for some reason
    let [isHomeClicked, setIsHomeClicked] = useState(true)
    let [topLoginMsg, setTopLoginMsg] = useState('')

    const setLoginMsg = (top) => {
        setTopLoginMsg(top)
        setIsLoginMsg(true)
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#92D3C3',
            },
        },
    })

    return <ul className='nav-list'>
        <NavLink
            to='/'
            className='home-link'
            onClick={() => setIsHomeClicked(true)}
        >
            <li>
                <ThemeProvider theme={theme}>
                    {!isHomeClicked &&
                        <div className='symbol home-icon'><HomeOutlinedIcon
                            sx={{
                                fontSize: '30px',
                            }} /></div>
                    }
                    {isHomeClicked &&
                        <div className='symbol home-icon'><HomeIcon
                            sx={{
                                fontSize: '30px',
                            }} /></div>
                    }
                    <div className='text'>Home</div>
                </ThemeProvider>
            </li>
        </NavLink>
        <NavLink
            to='/search'
            className='search-link'
            onClick={() => setIsHomeClicked(false)}
        >
            <li>
                <ThemeProvider theme={theme}>
                    <div className='symbol search'><ScreenSearchDesktopOutlinedIcon
                        sx={{
                            fontSize: '26px'
                        }} /></div>
                    <div className='symbol search'><ScreenSearchDesktopRoundedIcon /></div>
                    <div className='text-search'>Search</div>
                </ThemeProvider> </li>
        </NavLink>
        <NavLink
            onClick={user ? () => setIsHomeClicked(false) : () => setLoginMsg('150px')}
            to={user ? '/library' : '/'}
            className='library-link'>
            <li>
                <ThemeProvider theme={theme}>
                    <div className='symbol'> <LibraryMusicOutlinedIcon
                        sx={{
                            fontSize: '26px'
                        }} /></div>

                    <div className='symbol'><LibraryMusicIcon /></div>
                </ThemeProvider>
                <div className='text-library'>Library</div>
            </li>
        </NavLink>
        <div
            className='create-link'>
            <li onClick={user ? (isAddStation ? onAddStation : null) : () => setLoginMsg('190px')}>
                <ThemeProvider theme={theme}>
                    <div className='symbol plus'><AddBoxIcon sx={{
                        fontSize: '26px'
                    }} /> </div>
                </ThemeProvider>
                <div className='text-create'>Create Playlist</div>
            </li>
        </div>
        <NavLink
            to={user ? '/liked' : '/'}
            onClick={user ? () => setIsHomeClicked(false) : () => setLoginMsg('230px')}
        >
            <li>
                {/* <ThemeProvider theme={theme}> */}
                <div className='symbol'><img className='nav-likes-songs-logo' src={LikedSongsLogo} alt="" /></div>
                {/* <div className='symbol heart'> <FavoriteBorderIcon sx={{
                            fontSize: '26px'
                        }} /></div>
                        <div className='symbol heart'><FavoriteIcon /></div> */}
                {/* </ThemeProvider> */}
                <div className='text'>Liked Songs</div>
            </li>
        </NavLink>
        {/***************************************** Guest mode properties  *****************************************/}
        {isLoginMsg && <LoginMsg
            currTop={topLoginMsg}
            setIsLoginMsg={setIsLoginMsg} />}
    </ul>
}