import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import { useSelector } from 'react-redux'
import { setClip, setClipLength, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlayerFunc, setPlaylist } from '../store/media-player.actions.js'
import { useDispatch } from 'react-redux'
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import { utilService } from '../services/util.service.js'
import { storageService } from '../services/async-storage.service.js'
import { getTimeFormat } from '../services/media-player.service.js'
import { UserMsg } from './user-msg.jsx'
import { LikesBtns } from './likes-btn.jsx'
import { shortTitle } from '../services/clip.service.js'
import { userService } from '../services/user.service.js'
import { updateUser } from '../store/user.actions.js'
import { Slider } from '@mui/material'

export const MediaPlayer = () => {
    const dispatch = useDispatch()
    const loggedInUser = useSelector(state => state.userModule.user)
    let { currClip, currPlaylist, isPlaying, currTime, mediaPlayerInterval, playerFunc, clipLength } = useSelector(state => state.mediaPlayerModule)
    let [isMute, setIsMute] = useState(false)
    let [prevVolume, setPrevVolume] = useState()
    let [currVolume, setCurrVolume] = useState()
    let [playbackMode, setPlaybackMode] = useState('default-mode')
    let [isSwitchClip, setIsSwitchClip] = useState(true)
    let [thumbPos, setThumbPos] = useState(currTime)
    const navigate = useNavigate()

    useEffect(() => {
        const prevClip = storageService.loadFromStorage('prevClip')
        const currTime = storageService.loadFromStorage('currTime')?.[0]
        const currVolume = storageService.loadFromStorage('currVolume')?.[0]

        setCurrVolume(currVolume || 35)
        dispatch(setCurrTime(currTime || 0))

        if (!prevClip && currClip || prevClip?._id !== currClip?._id) {
            dispatch(setIsPlaying(true))
            // const currIdx = currPlaylist?.clips?.findIndex((clip) => clip._id === currClip._id)
            // const clipToPlay = currPlaylist?.clips[currIdx]
            // dispatch(setClip(clipToPlay))
            // dispatch(setPlaylist(currPlaylist))

        }
    }, [currClip])

    useEffect(() => {
        if (currClip && isPlaying) {
            clearInterval(mediaPlayerInterval)
            dispatch(setMediaPlayerInterval(setInterval(getTime, 750, playbackMode)))
        }
    }, [playbackMode])


    const onPlayClip = async () => {
        if (currClip) {
            dispatch(setIsPlaying(true))
            clearInterval(mediaPlayerInterval)
            if (currClip) {
                dispatch(setMediaPlayerInterval(setInterval(getTime, 750, playbackMode)))
                playerFunc.playVideo()
            }
        }
    }

    const onReady = async (event) => {
        playerFunc = event.target
        dispatch(setPlayerFunc(playerFunc))
        const Length = playerFunc.getDuration()
        playerFunc.setVolume(currVolume)
        dispatch(setClipLength(Length))
        setCurrVolume(currVolume)
        if (isPlaying) onPlayClip()
    }



    const handleChange = (ev) => {
        let name = ev.target.name
        let val = ev.target.value
        if (name === 'stream-line') {
            dispatch(setCurrTime(val))
            storageService.put('currTime', val)
            dispatch(setIsPlaying(true))
            playerFunc.seekTo(val)
        }
        if (name === 'volume') {
            setPrevVolume(currVolume)
            setCurrVolume(val)
            storageService.put('currVolume', val)
            playerFunc.unMute()
            playerFunc.setVolume(val)
        }
    }


    const setPosition = (val) => {
        dispatch(setCurrTime(val))
        storageService.put('currTime', val)
        dispatch(setIsPlaying(true))
        playerFunc.seekTo(val)
    }

    const onTogglePlay = () => {
        if (isPlaying) {
            clearInterval(mediaPlayerInterval)
            playerFunc.pauseVideo()
        }
        if (!isPlaying) {
            clearInterval(mediaPlayerInterval)
            dispatch(setMediaPlayerInterval(setInterval(getTime, 750, playbackMode)))
            playerFunc.playVideo()
            if (currTime) playerFunc.seekTo(currTime)
        }
        dispatch(setIsPlaying(!isPlaying))
    }

    const toggleMute = () => {
        if (!isMute) {
            playerFunc.mute()
            setIsMute(!isMute)
            setPrevVolume(currVolume)
            setCurrVolume(0)
        }
        if (isMute) {
            playerFunc.unMute()
            setIsMute(!isMute)
            setCurrVolume(prevVolume)
        }
    }

    const getTime = async (playbackMode = 'default-mode') => {
        console.log('MEDIA_PLAYER_GET_TIME:', mediaPlayerInterval, 'CURR_CLIPP:', currClip.title);
        currTime = await playerFunc.getCurrentTime()
        storageService.put('currTime', currTime)
        dispatch(setCurrTime(currTime))
        // const currThumbPos = thumbPos + currTime
        // setThumbPos(currThumbPos)
        if (currTime > clipLength - 1.5) switchClipByPlaybackMode(playbackMode)
    }

    const switchClipByPlaybackMode = async (mode = 'default-mode', time = 0) => {
        const currIdx = currPlaylist.clips.indexOf(currClip)
        let nextIdx = currIdx + 1
        switch (mode) {
            case !mode || 'default-mode':
                if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
                currClip = currPlaylist.clips[nextIdx]
                break
            case 'repeat-mode':
                clearInterval(mediaPlayerInterval)
                dispatch(setMediaPlayerInterval(setInterval(getTime, 750, playbackMode)))
                playerFunc.seekTo(time)
                onPlayClip()
                break
            case 'shuffle-mode':
                nextIdx = utilService.getRandomIntInclusive(0, currPlaylist.clips.length - 1)
                if (nextIdx === currIdx) nextIdx++
                currClip = currPlaylist.clips[nextIdx]
                break
            default:
        }
        dispatch(setClip(currClip))
        dispatch(setIsPlaying(true))
        const userToUpdate = { ...loggedInUser }
        userService.updateUserRecentlyPlayedClips(userToUpdate, currClip)
        dispatch(updateUser(userToUpdate))
    }

    const switchClip = async (switchNum) => {
        setIsSwitchClip(false)
        const currIdx = currPlaylist.clips.indexOf(currClip)
        let nextIdx = currIdx + switchNum
        if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
        if (nextIdx < 0) nextIdx = currPlaylist.clips.length - 1
        currClip = currPlaylist.clips[nextIdx]
        dispatch(setClip(currClip))
        dispatch(setIsPlaying(true))
        setIsSwitchClip(true)
        const userToUpdate = { ...loggedInUser }
        userService.updateUserRecentlyPlayedClips(userToUpdate, currClip)
        dispatch(updateUser(userToUpdate))
    }

    const skipTenSec = (skipNum) => {
        dispatch(setCurrTime(currTime + skipNum))
        playerFunc.seekTo(currTime + skipNum)
    }

    const onToggleQueue = () => {
        const params = window.location.href
        if (params.includes('clips-queue')) {
            navigate(-1)
        }
        else {
            navigate('/clips-queue')
        }
    }

    const opts = {
        height: '400',
        width: '400',
        playerVars: {
            autoplay: isPlaying ? 1 : 0,
        }
    }


    return (

        <div className='media-player-container'>

            {/***************** YouTube Media Player *****************/}
            <div className='mp-container'>
                <YouTube
                    videoId={currClip?._id}
                    opts={opts}
                    onReady={onReady} />
            </div>
            {/***************** Symphony Media Player *****************/}
            <div className='media-player-clip-container flex'>
                {currClip &&
                    <img
                        className='media-player-clip-img'
                        src={currClip?.img?.url || ''} />}
                <div className='media-player-clip-preview flex column'>
                    {<h1 className='flex'>{shortTitle(currClip)} <LikesBtns clip={currClip} /></h1>}
                    {<p>{currClip?.artist}</p>}
                </div>
            </div>
            <div className='mp-controller flex column'>

                {/***************** Main Buttons *****************/}
                <UserMsg />
                <div className='mp-btn-container'>

                    {playbackMode !== 'shuffle-mode' &&
                        <button className='action-btn fa-solid fa-shuffle'
                            title='Enable shuffle'
                            onClick={() => {
                                setPlaybackMode('shuffle-mode')
                            }}></button>
                    }

                    {playbackMode === 'shuffle-mode' &&
                        <button className='action-btn fa-solid fa-shuffle'
                            title='Disable shuffle'
                            style={{ color: '#1ED760' }}
                            onClick={() => {
                                setPlaybackMode('default-mode')
                            }}></button>
                    }

                    <Replay10RoundedIcon
                        className='skip10sec-btn'
                        onClick={() => skipTenSec(-10)} />

                    <button className='action-btn fas fa-step-backward'
                        title='Previous'
                        onClick={() => isSwitchClip ? switchClip(-1) : ''}></button>

                    <button className={'play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={onTogglePlay}></button>

                    <button className='action-btn fas fa-step-forward'
                        title='Next'
                        onClick={() => isSwitchClip ? switchClip(1) : ''}></button>

                    <Forward10RoundedIcon
                        className=' skip10sec-btn'
                        onClick={() => skipTenSec(10)} />

                    {playbackMode !== 'repeat-mode' &&
                        <button className='action-btn fa-solid fa-repeat'
                            title={'Enable repeat clip'}
                            onClick={() => {
                                setPlaybackMode('repeat-mode')
                            }}></button>
                    }

                    {playbackMode === 'repeat-mode' &&
                        <button className='action-btn fa-solid fa-repeat'
                            title={'Disable repeat clip'}
                            style={{ color: '#1ED760' }}
                            onClick={() => {
                                setPlaybackMode('default-mode')
                            }}></button>
                    }

                </div>

                {/***************** Stream Line *****************/}
                <div className='action-btn stream-line-container'>
                    <span className='track-time'>{getTimeFormat(currTime || 0)}</span>

                    <div className='stream-line-input'>
                        <Slider
                            aria-label="time-indicator"
                            size="small"
                            value={currTime || 0}
                            min={0}
                            step={1}
                            max={+clipLength || 0}
                            onChange={(_, value) => setPosition(value)}
                            sx={{
                                color: '#fff',
                                height: (window.innerWidth) > 415 ? 4 : 2
                                ,
                                '&:hover': {
                                    color: '#1db954',
                                    '& .MuiSlider-thumb': {
                                        width: 12,
                                        height: 12,
                                        display: 'unset',
                                        color: '#fff',
                                    },
                                },
                                '& .MuiSlider-thumb': {
                                    display: 'none',
                                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                },
                                '& .MuiSlider-rail': {
                                    color: '#4d4d4d'
                                },
                            }}
                        />
                    </div>

                    <span className='track-time'>{getTimeFormat(clipLength || 0)}</span>
                </div>
            </div>

            {/***************** Secondary Buttons *****************/}
            <div className='mp-2nd-controller'>

                <span
                    className='link-to-queue'
                    onClick={onToggleQueue} >
                    <QueueMusicRoundedIcon
                        className='queue-icon' />
                </span>

                <button className={'sound-btn ' + (!isMute ? 'sound-btn fas fa-volume-up' : 'sound-btn fas fa-volume-mute')}
                    onClick={toggleMute}>
                </button>

                {/***************** Volume Input *****************/}

                <label htmlFor='volume-input'></label>

                <input
                    title={currVolume}
                    name='volume'
                    className='volume-input'
                    value={currVolume || 0}
                    onChange={handleChange}
                    type='range' />
            </div>
        </div >
    )
}