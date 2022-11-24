import React from 'react'
import { NavLink } from 'react-router-dom'
import LikedSongsLogo from '../../src/assets/img/likedsongs.png'
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined'
import ScreenSearchDesktopRoundedIcon from '@mui/icons-material/ScreenSearchDesktopRounded'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useSelector } from 'react-redux'
import { NavListSymbol } from './nav-list-symbol'

export const NavList = ({
    isAddStation,
    onAddStation,
}) => {
    const { loggedinUser } = useSelector(state => state.userModule)


    const navLinks = [
        {
            path: '/',
            className: 'home-link',
            symbol: {
                unclicked: <HomeOutlinedIcon />,
                clicked: <HomeRoundedIcon />,
                txt: 'Home',
            }
        },
        {
            path: 'search',
            className: 'search-link',
            symbol: {
                unclicked: <ScreenSearchDesktopOutlinedIcon />,
                clicked: <ScreenSearchDesktopRoundedIcon />,
                txt: 'Search',
            }
        },
        {
            path: 'library',
            className: 'library-link',
            symbol: {
                unclicked: <LibraryMusicOutlinedIcon />,
                clicked: <LibraryMusicIcon />,
                txt: 'Your Library',
            }
        },
        {
            path: null,
            className: 'create-playlist-link',
            symbol: {
                unclicked: <AddBoxIcon />,
                clicked: null,
                txt: 'Create Playlist',
            }
        },
        {
            path: 'liked',
            className: 'liked-songs-link',
            symbol: {
                unclicked: <img className='nav-likes-songs-logo' src={LikedSongsLogo} alt="liked songs logo" />,
                clicked: null,
                txt: 'Liked Songs',
            }
        },
    ]

    return (
        <ul className='nav-list'>
            {navLinks.map((navLink, idx) => {
                const { path, className, symbol } = navLink
                if (!loggedinUser && idx > 1) {
                    return <span key={'nav-link-' + navLink.className} className={className} >
                        <NavListSymbol symbol={symbol} />
                    </span>
                }

                return (
                    <NavLink
                        to={path}
                        end={true}
                        key={'nav-link-' + navLink.className}
                        className={className}
                    >
                        <NavListSymbol symbol={symbol} isAddStation={isAddStation} onAddStation={onAddStation} />
                    </NavLink>
                )
            })}
        </ul>
    )
}