import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import YouTube from 'react-youtube'
import { LikeIcon } from './like-icon.jsx'
import { setMediaPlayerClip, setIsPlaying, setOnTogglePlay } from '../store/media-player.actions.js'
import { mediaPlayerService } from '../services/media-player.service.js'
import { clipService } from '../services/clip.service.js'
import { userService } from '../services/user.service.js'
import { storageService } from '../services/storage.service.js'
import { utilService } from '../services/util.service.js'
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import { Slider } from '@mui/material'
import { updateUser } from '../store/user.actions.js'

export const MediaPlayer = () => {
    const dispatch = useDispatch()
    const { loggedinUser } = useSelector(state => state.userModule)
    const { currMediaPlayerClip, currPlaylist, isPlaying } = useSelector(state => state.mediaPlayerModule)
    const [isMute, setIsMute] = useState(false)
    const [prevVolume, setPrevVolume] = useState()
    const [currVolume, setCurrVolume] = useState(storageService.loadFromStorage('currVolume') || 35)
    const [currTime, setCurrTime] = useState(storageService.loadFromStorage('currTime') || 0)
    const [playbackMode, setPlaybackMode] = useState('default-mode')
    const [isSwitchClip, setIsSwitchClip] = useState(true)
    const [clipLength, setClipLength] = useState()
    const navigate = useNavigate()

    let playerFunc = useRef()
    let mediaPlayerInterval = useRef()

    useEffect(() => {
        const prevClip = mediaPlayerService.getPrevClip()
        if ((!prevClip && currMediaPlayerClip) || (prevClip?._id !== currMediaPlayerClip?._id)) {
            storageService.saveToStorage('prevClip', currMediaPlayerClip)
            storageService.saveToStorage('prevPlaylist', currPlaylist)
            if (loggedinUser) {
                let userToUpdate = { ...loggedinUser }
                userToUpdate = userService.updateUserRecentlyPlayedClips(userToUpdate, currMediaPlayerClip)
                userToUpdate.prevClip = currMediaPlayerClip
                userToUpdate.prevPlaylist = currPlaylist
                dispatch(updateUser(userToUpdate))
            }
            dispatch(setIsPlaying(true))
        }

    }, [currMediaPlayerClip])

    useEffect(() => {
        if (currMediaPlayerClip && isPlaying) {
            clearInterval(mediaPlayerInterval.current)
            mediaPlayerInterval.current = setInterval(getTime, 750, playbackMode)
        }
    }, [playbackMode])


    useEffect(() => {
        dispatch(setOnTogglePlay(onTogglePlay))
    }, [isPlaying])

    const onReady = async (event) => {
        playerFunc.current = event.target
        const currLength = await playerFunc.current.getDuration()
        setClipLength(currLength)
        playerFunc.current.setVolume(currVolume)
        setCurrVolume(currVolume)
        if (isPlaying) onPlayClip(currLength)
    }

    const onPlayClip = (currClipLength = clipLength) => {
        if (currMediaPlayerClip) {
            dispatch(setIsPlaying(true))
            clearInterval(mediaPlayerInterval.current)
            mediaPlayerInterval.current = setInterval(getTime, 750, playbackMode, currClipLength)
            playerFunc.current.playVideo()
        }
    }

    const onTogglePlay = () => {
        if (isPlaying) {
            clearInterval(mediaPlayerInterval.current)
            playerFunc.current.pauseVideo()
        }
        if (!isPlaying) {
            clearInterval(mediaPlayerInterval.current)
            playerFunc.current.playVideo()
            playerFunc.current.seekTo(currTime)
            mediaPlayerInterval.current = setInterval(getTime, 750, playbackMode)
        }
        dispatch(setIsPlaying(!isPlaying))
    }

    const setPosition = (val, sliderName) => {
        if (sliderName === 'time-line') {
            setCurrTime(val)
            storageService.saveToStorage('currTime', val)
            dispatch(setIsPlaying(true))
            playerFunc.current.seekTo(val)
        }
        if (sliderName === 'volume') {
            setPrevVolume(currVolume)
            setCurrVolume(val)
            storageService.saveToStorage('currVolume', val)
            playerFunc.current.unMute()
            playerFunc.current.setVolume(val)
        }
    }

    const toggleMute = () => {
        if (!isMute) {
            playerFunc.current.mute()
            setIsMute(!isMute)
            setPrevVolume(currVolume)
            setCurrVolume(0)
        }
        if (isMute) {
            playerFunc.current.unMute()
            setIsMute(!isMute)
            setCurrVolume(prevVolume)
        }
    }

    const getTime = async (playbackMode = 'default-mode', currClipLength = clipLength) => {
        const updatedTime = await playerFunc.current.getCurrentTime()
        storageService.saveToStorage('currTime', updatedTime)
        setCurrTime(updatedTime)
        if (updatedTime > currClipLength - 1.5) switchClipByPlaybackMode(playbackMode)
    }

    const skipTenSec = (skipNum) => {
        setCurrTime(currTime + skipNum)
        playerFunc.current.seekTo(currTime + skipNum)
    }

    const switchClipByPlaybackMode = async (mode) => {
        const currIdx = currPlaylist.clips.indexOf(currMediaPlayerClip)
        let nextIdx = currIdx + 1
        let nextMediaPlayerClip
        switch (mode) {
            case !mode || 'default-mode':
                if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
                nextMediaPlayerClip = currPlaylist.clips[nextIdx]
                break
            case 'repeat-mode':
                clearInterval(mediaPlayerInterval.current)
                mediaPlayerInterval.current = setInterval(getTime, 750, playbackMode)
                playerFunc.current.seekTo(0)
                onPlayClip()
                return
            case 'shuffle-mode':
                nextIdx = utilService.getRandomIntInclusive(0, currPlaylist.clips.length - 1)
                if (nextIdx === currIdx) nextIdx++
                nextMediaPlayerClip = currPlaylist.clips[nextIdx]
                break
            default:
        }
        dispatch(setMediaPlayerClip(nextMediaPlayerClip))
        dispatch(setIsPlaying(true))
    }

    const switchClip = async (switchNum) => {
        setIsSwitchClip(false)
        const currIdx = currPlaylist.clips.indexOf(currMediaPlayerClip)
        let nextIdx = currIdx + switchNum
        if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
        if (nextIdx < 0) nextIdx = currPlaylist.clips.length - 1
        let nextMediaPlayerClip = currPlaylist.clips[nextIdx]
        dispatch(setMediaPlayerClip(nextMediaPlayerClip))
        dispatch(setIsPlaying(true))
        setIsSwitchClip(true)
    }

    const onToggleQueue = () => {
        const params = window.location.href
        if (params.includes('queue')) {
            navigate(-1)
        }
        else {
            navigate('/queue')
        }
    }

    const mainBtns = [
        {
            className: 'action-btn fa-solid fa-shuffle',
            title: playbackMode === 'shuffle-mode' ? 'Disable shuffle' : 'Enable shuffle',
            style: { color: playbackMode === 'shuffle-mode' ? '#1ED760' : '' },
            onClickFunc: () => {
                setPlaybackMode(playbackMode === 'shuffle-mode' ? 'default-mode' : 'shuffle-mode')
            }
        },
        {
            className: 'action-btn skip10sec-btn replay',
            title: 'Skip back 10 seconds',
            style: null,
            onClickFunc: () => skipTenSec(-10),
            icon: <Replay10RoundedIcon />
        },
        {
            className: 'action-btn fas fa-step-backward',
            title: 'Previous',
            style: null,
            onClickFunc: () => isSwitchClip ? switchClip(-1) : null
        },
        {
            className: 'action-btn play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing'),
            title: isPlaying ? 'Pause' : 'Play',
            style: null,
            onClickFunc: onTogglePlay
        },
        {
            className: 'action-btn fas fa-step-forward',
            title: 'Next',
            style: null,
            onClickFunc: () => isSwitchClip ? switchClip(1) : null
        },
        {
            className: 'action-btn skip10sec-btn forwrard',
            title: 'Skip forward 10 seconds',
            style: null,
            onClickFunc: () => skipTenSec(10),
            icon: <Forward10RoundedIcon />
        },
        {
            className: 'action-btn fa-solid fa-repeat',
            title: playbackMode === 'repeat-mode' ? 'Disable repeat clip' : 'Enable repeat clip',
            style: { color: playbackMode === 'repeat-mode' ? '#1ED760' : '' },
            onClickFunc: () => {
                setPlaybackMode(playbackMode === 'repeat-mode' ? 'default-mode' : 'repeat-mode')
            }
        }
    ]

    const setSlider = (ariaLable, val, max, type, height) => {
        return (
            <Slider
                getAriaLabel={() => ariaLable}
                size='small'
                value={val || 0}
                min={0}
                step={1}
                max={+max || 0}
                onChange={(_, value) => setPosition(value, type)}
                sx={{
                    color: '#fff', height,padding: '0',
                    '&:hover': {
                        color: '#1db954', '& .MuiSlider-thumb': {
                            width: 12, height: 12, display: 'unset', color: '#fff',
                        },
                    },
                    '& .MuiSlider-thumb': {
                        display: 'none', transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    },
                    '& .MuiSlider-rail': {
                        color: '#4d4d4d'
                    },
                }}
            />
        )
    }

    return (
        <footer className='media-player-container'>
            <YouTube
                className='youtube-player'
                videoId={currMediaPlayerClip?._id}
                opts={{ playerVars: { autoplay: isPlaying ? 1 : 0 } }}
                onReady={onReady} />

            <section className='media-player-clip-preview flex'>
                {currMediaPlayerClip &&
                    <img
                        className='media-player-clip-img'
                        title={clipService.getFormattedTitle(currMediaPlayerClip) + ', ' + currMediaPlayerClip?.artist}
                        src={currMediaPlayerClip?.img?.url || ''}
                        alt='mediaplayer-img' />}

                <div className='media-player-clip-txt flex column'>
                    {<h1 className='mp-clip-title'>
                        {clipService.getFormattedTitle(currMediaPlayerClip)}
                    </h1>}
                    {<p className='mp-clip-artist'>{currMediaPlayerClip?.artist}</p>}
                </div>
                {(loggedinUser && currMediaPlayerClip) &&
                    <LikeIcon
                        isMediaPlayer={true}
                        currStation={currPlaylist}
                        currClip={currMediaPlayerClip}
                        inputId={'mediaPlayerClip'}
                    />}
            </section>

            <section className='mp-controller flex column'>
                <div className='mp-btn-container'>
                    {mainBtns.map(btn => {
                        const { className, title, style, onClickFunc, icon } = btn
                        return (
                            <button
                                key={'mp-btn-' + btn.className}
                                className={className}
                                title={title}
                                style={style}
                                onClick={onClickFunc}>
                                {icon}
                            </button>
                        )
                    })}
                </div>

                <div className='time-line-container'>
                    <span className='track-time'>{mediaPlayerService.getFormattedTime(currTime || 0)}</span>

                    <section className='time-line-input'>
                        {setSlider('time-indicator', currTime, clipLength, 'time-line', (window.innerWidth) > 415 ? 4 : 2)}
                    </section>

                    <span className='track-time'>{mediaPlayerService.getFormattedTime(clipLength || 0)}</span>
                </div>
            </section>

            <section className='mp-2nd-controller'>
                <div className='mp-btn-2nd-container flex'>
                    {currPlaylist &&
                        <span
                            className='link-to-queue'
                            onClick={onToggleQueue} >
                            <QueueMusicRoundedIcon
                                className='queue-icon' />
                        </span>}

                    <button className={'toggle-mute-btn ' + (!isMute ? 'toggle-mute-btn fas fa-volume-up' : 'toggle-mute-btn fas fa-volume-mute')}
                        onClick={toggleMute}>
                    </button>
                </div>

                <div className='volume-input-container'>
                    <section className='volume-input'>
                        {setSlider('volume-indicator', currVolume, 100, 'volume', 4)}
                    </section>
                </div>
            </section>
        </footer >
    )
}