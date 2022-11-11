import React, { useRef } from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { loginFirstMsgs } from "../services/user.service"
import { Equalizer } from "./equalizer"
import { LoginFirstMsg } from "./login-first-msg"

export const NavListSymbol = ({
    symbol,
    isAddStation,
    onAddStation
}) => {

    const { loggedinUser } = useSelector(state => state.userModule)
    const { currPlaylist, isPlaying } = useSelector(state => state.mediaPlayerModule)
    const [isLikedSongsPlaying, setIsLikedSongsPlaying] = useState(false)
    const [loginMsgProperties, setLoginMsgProperties] = useState(null)
    const [isLoginMsg, setIsLoginMsg] = useState(false)

    const setLoginMsg = (properties) => {
        setLoginMsgProperties(properties)
        setIsLoginMsg(!isLoginMsg)
    }

    switch (symbol.txt) {
        case 'Your Library':
            symbol.func = loggedinUser ? null : () => setLoginMsg(loginFirstMsgs.library)
            break;
        case 'Create Playlist':
            symbol.func = loggedinUser ? isAddStation ? () => onAddStation : null : () => setLoginMsg(loginFirstMsgs.createPlaylist)
            break;
        case 'Liked Songs':
            symbol.func = loggedinUser ? null : () => setLoginMsg(loginFirstMsgs.likedSongs)
            break;
        default:
            break;
    }

    useEffect(() => {
        if (!currPlaylist) return
        if (currPlaylist.name === 'Liked Songs' && isPlaying) setIsLikedSongsPlaying(true)
        else setIsLikedSongsPlaying(false)
    }, [currPlaylist, isPlaying])

    return (
        <li className='symbol-container'
            onClick={symbol.func}>
            <div className='symbol'>
                {symbol.unclicked}
            </div>
            {symbol.clicked &&
                <div className='symbol'>
                    {symbol.clicked}
                </div>}
            <span className='symbol-txt'>{symbol.txt}</span>
            {(symbol.txt === 'Liked Songs' && isLikedSongsPlaying) &&
                <span
                    className='liked-songs-playing-icon'>
                    <Equalizer />
                </span>}

            {isLoginMsg && <React.Fragment>
                <div className='main-screen'
                    onClick={() => setIsLoginMsg(false)} ></div>
                <LoginFirstMsg
                    loginMsgProperties={loginMsgProperties}
                    setIsLoginMsg={setIsLoginMsg} />
            </React.Fragment>}
        </li>
    )
}