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

    // const checkTxt = 'CHECK'

    // const MiniMediaPlayer = () => {
    //     let [currTime, setCurrTime] = useState()
    //     let [isPlaying, setIsPlaying] = useState(false)
    //     let [playerFunc, setplayerFunc] = useState()
    //     let [clipLength, setClipLength] = useState()
    //     let intervalId = useRef()

    //     const handleChange = ({ target }) => {
    //         setCurrTime(target.value)
    //         setIsPlaying(true)
    //         playerFunc.seekTo(target.value)
    //     }

    //     const onReady = async (event) => {
    //         playerFunc = event.target
    //         clipLength = playerFunc.getDuration()
    //         setplayerFunc(playerFunc)
    //         setClipLength(clipLength)
    //     }

    //     const getTime = async () => {
    //         currTime = await playerFunc.getCurrentTime()
    //         setCurrTime(currTime)
    //     }

    //     const onTogglePlay = () => {
    //         if (isPlaying) {
    //             clearInterval(intervalId.current)
    //             playerFunc.pauseVideo()
    //         }
    //         if (!isPlaying) {
    //             intervalId.current = setInterval(getTime, 750)
    //             playerFunc.playVideo()
    //             if (currTime) playerFunc.seekTo(currTime)
    //         }
    //         setIsPlaying(!isPlaying)
    //     }

    //     const getTimeFormat = (duration) => {
    //         let min = Math.floor(duration / 60)
    //         let sec = Math.ceil(duration % 60)
    //         if (sec < 10) sec = '0' + sec
    //         if (sec === 60) {
    //             sec = '00'
    //             min++
    //         }
    //         return (min + ':' + sec)
    //     }

    //     const opts = {
    //         height: '0',
    //         width: '0',
    //         playerVars: {
    //             autoplay: isPlaying ? 1 : 0,
    //         }
    //     }

    //     return (
    //         <div className="mini-media-player-container">
    //             {/* <img src={clip.img.url} alt="" /> */}
    //             <YouTube
    //                 videoId={'phaJXp_zMYM'}
    //                 opts={opts}
    //                 onPlay={() => getTime()}
    //                 onReady={onReady} />
    //             <div className='action-btn stream-line-container'>
    //                 <label htmlFor='stream-line-input'></label>
    //                 <input
    //                     name='stream-line'
    //                     className='stream-line-input'
    //                     size='medium'
    //                     value={currTime || 0}
    //                     max={+clipLength || 0}
    //                     onChange={handleChange}
    //                     type='range' />
    //                 <span className='track-time'>{getTimeFormat(clipLength || 0)}</span>
    //             </div>
    //             <button className={'play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing')}
    //                 onClick={onTogglePlay}></button>
    //         </div>
    //     )
    // }



    //     // Place this pointer at your desired destination
    //     // { MiniMediaPlayerForQueen}

    //     const MiniMediaPlayerForQueen = () => {
    //         let [currTime, setCurrTime] = useState()
    //         let [isPlaying, setIsPlaying] = useState(false)
    //         let [playerFunc, setplayerFunc] = useState()
    //         let [clipLength, setClipLength] = useState()
    //         let intervalId = useRef()

    //         const handleChange = ({ target }) => {
    //             setCurrTime(target.value)
    //             setIsPlaying(true)
    //             playerFunc.seekTo(target.value)
    //         }

    //         const onReady = async (event) => {
    //             playerFunc = event.target
    //             clipLength = playerFunc.getDuration()
    //             setplayerFunc(playerFunc)
    //             setClipLength(clipLength)
    //         }

    //         const getTime = async () => {
    //             currTime = await playerFunc.getCurrentTime()
    //             setCurrTime(currTime)
    //         }

    //         const onTogglePlay = () => {
    //             if (isPlaying) {
    //                 clearInterval(intervalId.current)
    //                 playerFunc.pauseVideo()
    //             }
    //             if (!isPlaying) {
    //                 intervalId.current = setInterval(getTime, 750)
    //                 playerFunc.playVideo()
    //                 if (currTime) playerFunc.seekTo(currTime)
    //             }
    //             setIsPlaying(!isPlaying)
    //         }

    //         const getTimeFormat = (duration) => {
    //             let min = Math.floor(duration / 60)
    //             let sec = Math.ceil(duration % 60)
    //             if (sec < 10) sec = '0' + sec
    //             if (sec === 60) {
    //                 sec = '00'
    //                 min++
    //             }
    //             return (min + ':' + sec)
    //         }

    //         const opts = {
    //             height: '0',
    //             width: '0',
    //             playerVars: {
    //                 autoplay: isPlaying ? 1 : 0,
    //             }
    //         }

    //         return (
    //             <div className="mini-media-player-container">
    //             <img src={'https://i.ytimg.com/vi/HgzGwKwLmgM/default.jpg'} alt="mini-player-img" />
    //                 <YouTube
    //                     videoId={'phaJXp_zMYM'}
    //                     opts={opts}
    //                     onPlay={() => getTime()}
    //                     onReady={onReady} />
    //                 <div className='action-btn stream-line-container'>
    //                     <label htmlFor='stream-line-input'></label>
    //                     <input
    //                         name='stream-line'
    //                         className='stream-line-input'
    //                         size='medium'
    //                         value={currTime || 0}
    //                         max={+clipLength || 0}
    //                         onChange={handleChange}
    //                         type='range' />
    //                     <span className='track-time'>{getTimeFormat(clipLength || 0)}</span>
    //                 </div>
    //                 <button className={'play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing')}
    //                     onClick={onTogglePlay}></button>
    //             </div>
    //         )
    //     }

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


    return (
        < div >

        <div className="cmps-map-container">
            <ul className="cmps-map">
                <li>AppHeader</li>
                <li>SideBar</li>
                <li>SymphonyApp
                    <ul>
                        <li>StationList
                            <ul>
                                <li>LikedSongsPreview</li>
                                <li>StationPreview</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>About</li>
                <li>DownloadApp</li>
                <li>Login</li>
                <li>Signup</li>
                <li>UserProfile
                    <ul>
                        <li>ProfileHeader
                            <ul>
                                <li>ProfileDropdown</li>
                                <li>ProfileEdit</li>
                            </ul>
                        </li>
                        <li>ClipListHeader</li>
                        <li>DraggableClipList... </li>
                        <li>ProfileList</li>
                        <ul><li>ProfilePreview</li></ul>
                        <li>StationList...</li>
                    </ul>
                </li>
                <li>Search
                    <ul>
                        <li>SearchBar</li>
                        <li>StationList...</li>
                        <li>TagList
                            <ul>
                                <li>TagsPreview</li>
                            </ul>
                        </li>
                    </ul>
                    <li>SearchList
                        <ul>
                            <li>SearchResult
                                <ul>
                                    <li>ClipPreview</li>
                                    <li>UserSearchResult</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>StationList...</li>
                    <li>ProfileList...</li>
                </li>

                <li>StationDetails
                    <ul>
                        <li>StationHeader
                            <ul>
                                <li>HeaderDetails</li>
                                <li>StationDropdown</li>
                                <li>StationEdit</li>
                            </ul>
                        </li>
                        <li>ClipListHeader...</li>
                        <li>ClipList
                            <ul>
                                <li>ClipPreview...</li>
                            </ul>
                            <li>DraggableClipList
                                <ul>
                                    <li>ClipPreview
                                        <ul>
                                            <li>LikesBtns</li>
                                            <li>ClipDropdown
                                                <ul>
                                                    <li>DropDownList</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </li>
                        <li>SearchBar...</li>
                        <li>SearchList...</li>
                    </ul>
                </li>
                <li>LikedSongs
                    <ul>
                        <li>StationHeader...

                        </li>
                        <li>ClipListHeader</li>
                        <li>DraggableClipList...</li>
                    </ul>
                </li>
                <li>TagsDetails
                    <ul>StationList...</ul>
                </li>
                <li>Library
                    <ul>
                        <li>StationList...</li>
                    </ul>
                </li>
                <li>ClipsQueue
                    <ul>
                        <li>ClipPreview...</li>
                    </ul>
                </li>
                <li>MediaPlayer</li>
            </ul>
        </div>




            {/**************************************** HORIZONTAL DND EXAMPLE ***************************************/ }
    <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='DND-TST' direction="horizontal">
            {(provided) => (
                <div
                    className='DND-TST flex'
                    {...provided.droppableProps}
                    ref={provided.innerRef}>
                    {array.map(({ em, _id }, idx) => {
                        return (
                            <Draggable
                                key={_id}
                                draggableId={_id}
                                index={idx}>
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >{em}</div>
                                )}
                            </Draggable>
                        )
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>



    {/* 
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
            </DragDropContext> */}


    {/* <button onClick={() => {
                navigator.clipboard.writeText(createMiniMediaPlayer(
                    {
                        title: 'Queen',
                        img: { url: 'https://i.ytimg.com/vi/HgzGwKwLmgM/default.jpg' },
                        _id: 'phaJXp_zMYM'
                    }))
            }}
            >copy to clipboard</button>
            {MiniMediaPlayerForQueen()} */}
        </div >
    )
}