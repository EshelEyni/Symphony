import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import YouTube from 'react-youtube';
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { createMiniMediaPlayer } from '../services/media-player.service';
import { setHeaderBgcolor } from '../store/app-header.actions';

export const About = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
    }, [])

    let [array, setArray] = useState(
        [
            { em: '👤', _id: '1' },
            { em: '📙', _id: '2' },
            { em: '🏠', _id: '3' },
            { em: '🐷', _id: '4' },
            { em: '🦍', _id: '5' }
        ])

    function handleOnDragEnd(res) {
        if (!res.destination) return
        const items = Array.from(array)
        const [reorderedItem] = items.splice(res.source.index, 1)
        items.splice(res.destination.index, 0, reorderedItem)

        setArray(items)
    }


    const clipCmps = [
        {
            type: 'homepage-playlist',
            isDrag: false,
            data: ['title', 'artist', 'date added', 'time'],
            playBtn: 'next to',
            likeBtn: ['display:none', 'hover state'],
            cmp: 'clip-preview'
        },
        {
            type: 'liked-songs-playlist',
            isDrag: false,
            data: ['title', 'artist', 'date added', 'time'],
            playBtn: 'next to',
            likeBtn: ['display:block', 'dislike === remove'],
            cmp: 'clip-preview'
        },
        {
            type: 'user-station-playlist',
            isDrag: true,
            data: ['title', 'artist', 'date added', 'time'],
            playBtn: 'next to',
            likeBtn: ['display:none', 'hover state'],
            cmp: 'clip-preview'
        },
        {
            type: 'queue-playlist',
            isDrag: false,
            data: ['title', 'artist', 'time'],
            playBtn: 'next to',
            likeBtn: ['display:none', 'hover state']
        },
        {
            type: 'search-playlist',
            isDrag: false,
            data: ['title', 'artist', 'time'],
            playBtn: 'inside-img',
            likeBtn: ['display:none', 'hover state'],
            cmp: 'search-result'
        }
    ]

    const checkTxt = 'CHECK'

    const MiniMediaPlayer = () => {
        let [currTime, setCurrTime] = useState()
        let [isPlaying, setIsPlaying] = useState(false)
        let [playerFunc, setplayerFunc] = useState()
        let [clipLength, setClipLength] = useState()
        let intervalId = useRef()

        const handleChange = ({ target }) => {
            setCurrTime(target.value)
            setIsPlaying(true)
            playerFunc.seekTo(target.value)
        }

        const onReady = async (event) => {
            playerFunc = event.target
            clipLength = playerFunc.getDuration()
            setplayerFunc(playerFunc)
            setClipLength(clipLength)
        }

        const getTime = async () => {
            currTime = await playerFunc.getCurrentTime()
            setCurrTime(currTime)
        }

        const onTogglePlay = () => {
            if (isPlaying) {
                clearInterval(intervalId.current)
                playerFunc.pauseVideo()
            }
            if (!isPlaying) {
                intervalId.current = setInterval(getTime, 750)
                playerFunc.playVideo()
                if (currTime) playerFunc.seekTo(currTime)
            }
            setIsPlaying(!isPlaying)
        }

        const getTimeFormat = (duration) => {
            let min = Math.floor(duration / 60)
            let sec = Math.ceil(duration % 60)
            if (sec < 10) sec = '0' + sec
            if (sec === 60) {
                sec = '00'
                min++
            }
            return (min + ':' + sec)
        }

        const opts = {
            height: '0',
            width: '0',
            playerVars: {
                autoplay: isPlaying ? 1 : 0,
            }
        }

        return (
            <div className="mini-media-player-container">
                {/* <img src={clip.img.url} alt="" /> */}
                <YouTube
                    videoId={'phaJXp_zMYM'}
                    opts={opts}
                    onPlay={() => getTime()}
                    onReady={onReady} />
                <div className='action-btn stream-line-container'>
                    <label htmlFor='stream-line-input'></label>
                    <input
                        name='stream-line'
                        className='stream-line-input'
                        size='medium'
                        value={currTime || 0}
                        max={+clipLength || 0}
                        onChange={handleChange}
                        type='range' />
                    <span className='track-time'>{getTimeFormat(clipLength || 0)}</span>
                </div>
                <button className={'play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing')}
                    onClick={onTogglePlay}></button>
            </div>
        )
    }

    
  
        // Place this pointer at your desired destination
        
        const MiniMediaPlayerForQueen2 = () => {
            let [currTime, setCurrTime] = useState()
            let [isPlaying, setIsPlaying] = useState(false)
            let [playerFunc, setplayerFunc] = useState()
            let [clipLength, setClipLength] = useState()
            let intervalId = useRef()

            const handleChange = ({ target }) => {
                setCurrTime(target.value)
                setIsPlaying(true)
                playerFunc.seekTo(target.value)
            }

            const onReady = async (event) => {
                playerFunc = event.target
                clipLength = playerFunc.getDuration()
                setplayerFunc(playerFunc)
                setClipLength(clipLength)
            }

            const getTime = async () => {
                currTime = await playerFunc.getCurrentTime()
                setCurrTime(currTime)
            }

            const onTogglePlay = () => {
                if (isPlaying) {
                    clearInterval(intervalId.current)
                    playerFunc.pauseVideo()
                }
                if (!isPlaying) {
                    intervalId.current = setInterval(getTime, 750)
                    playerFunc.playVideo()
                    if (currTime) playerFunc.seekTo(currTime)
                }
                setIsPlaying(!isPlaying)
            }

            const getTimeFormat = (duration) => {
                let min = Math.floor(duration / 60)
                let sec = Math.ceil(duration % 60)
                if (sec < 10) sec = '0' + sec
                if (sec === 60) {
                    sec = '00'
                    min++
                }
                return (min + ':' + sec)
            }

            const opts = {
                height: '0',
                width: '0',
                playerVars: {
                    autoplay: isPlaying ? 1 : 0,
                }
            }

            return (
                <div className="mini-media-player-container">
                <img src={'https://i.ytimg.com/vi/HgzGwKwLmgM/default.jpg'} alt="mini-player-img" />
                    <YouTube
                        videoId={'phaJXp_zMYM'}
                        opts={opts}
                        onPlay={() => getTime()}
                        onReady={onReady} />
                    <div className='action-btn stream-line-container'>
                        <label htmlFor='stream-line-input'></label>
                        <input
                            name='stream-line'
                            className='stream-line-input'
                            size='medium'
                            value={currTime || 0}
                            max={+clipLength || 0}
                            onChange={handleChange}
                            type='range' />
                        <span className='track-time'>{getTimeFormat(clipLength || 0)}</span>
                    </div>
                    <button className={'play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={onTogglePlay}></button>
                </div>
            )
        }
        
  
        // Place this pointer at your desired destination
        // { MiniMediaPlayerForQueen}
        
        const MiniMediaPlayerForQueen = () => {
            let [currTime, setCurrTime] = useState()
            let [isPlaying, setIsPlaying] = useState(false)
            let [playerFunc, setplayerFunc] = useState()
            let [clipLength, setClipLength] = useState()
            let intervalId = useRef()

            const handleChange = ({ target }) => {
                setCurrTime(target.value)
                setIsPlaying(true)
                playerFunc.seekTo(target.value)
            }

            const onReady = async (event) => {
                playerFunc = event.target
                clipLength = playerFunc.getDuration()
                setplayerFunc(playerFunc)
                setClipLength(clipLength)
            }

            const getTime = async () => {
                currTime = await playerFunc.getCurrentTime()
                setCurrTime(currTime)
            }

            const onTogglePlay = () => {
                if (isPlaying) {
                    clearInterval(intervalId.current)
                    playerFunc.pauseVideo()
                }
                if (!isPlaying) {
                    intervalId.current = setInterval(getTime, 750)
                    playerFunc.playVideo()
                    if (currTime) playerFunc.seekTo(currTime)
                }
                setIsPlaying(!isPlaying)
            }

            const getTimeFormat = (duration) => {
                let min = Math.floor(duration / 60)
                let sec = Math.ceil(duration % 60)
                if (sec < 10) sec = '0' + sec
                if (sec === 60) {
                    sec = '00'
                    min++
                }
                return (min + ':' + sec)
            }

            const opts = {
                height: '0',
                width: '0',
                playerVars: {
                    autoplay: isPlaying ? 1 : 0,
                }
            }

            return (
                <div className="mini-media-player-container">
                <img src={'https://i.ytimg.com/vi/HgzGwKwLmgM/default.jpg'} alt="mini-player-img" />
                    <YouTube
                        videoId={'phaJXp_zMYM'}
                        opts={opts}
                        onPlay={() => getTime()}
                        onReady={onReady} />
                    <div className='action-btn stream-line-container'>
                        <label htmlFor='stream-line-input'></label>
                        <input
                            name='stream-line'
                            className='stream-line-input'
                            size='medium'
                            value={currTime || 0}
                            max={+clipLength || 0}
                            onChange={handleChange}
                            type='range' />
                        <span className='track-time'>{getTimeFormat(clipLength || 0)}</span>
                    </div>
                    <button className={'play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={onTogglePlay}></button>
                </div>
            )
        }
        




















    

    return (

        <div>

            <button onClick={() => {
                navigator.clipboard.writeText(createMiniMediaPlayer(
                    {
                        title: 'Queen',
                        img: { url: 'https://i.ytimg.com/vi/HgzGwKwLmgM/default.jpg' },
                        _id: 'phaJXp_zMYM'
                    }))
            }}
            >copy to clipboard</button>


            {/* {MiniMediaPlayer()} */}

            { MiniMediaPlayerForQueen()}


            <iframe
                src="https://open.spotify.com/embed/track/2Fxmhks0bxGSBdJ92vM42m?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"></iframe>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='DND-TST'>
                    {(provided) => (
                        <ul
                            className='DND-TST'
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            {array.map(({ em, _id }, idx) => {
                                return (
                                    <Draggable
                                        key={_id}
                                        draggableId={_id}
                                        index={idx}>
                                        {(provided) => (
                                            <li
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >{em}</li>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>


            { MiniMediaPlayerForQueen2()}

        </div>

    )


    return (
        <div>
            <h1>
                About us
            </h1>
            <div className='about-container flex space-around'>
                <div>
                    Eshel
                </div>
                <div>
                    Daria
                </div>
                <div>
                    Alex
                </div>
            </div>

        </div>
    )
}