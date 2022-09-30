import { useSelector, useDispatch } from 'react-redux'
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from '../store/media-player.actions.js'
import LikedSongLogo from '../assets/img/likedsongs.png'
import { ClipListHeader } from '../cmps/clip-list-header'
import { StationHeader } from '../cmps/station-header'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { DraggableClipList } from '../cmps/draggable-clip-list'
import { handleDragEnd } from '../services/dragg.service'
import { useEffect, useState } from 'react'
import { updateUser } from '../store/user.actions'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { likedSongsBgcolor } from '../services/bg-color.service.js'
import { storageService } from '../services/async-storage.service.js'
import LikedSongsLogo from '../../src/assets/img/likedsongs.png'



export const LikedSongs = () => {
    const user = useSelector(state => state.userModule.user)
    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)

    const dispatch = useDispatch()
    let [clips, setClips] = useState()
 
    useEffect(() => {
        setClip(user.likedSongs)
        dispatch(setHeaderBgcolor(likedSongsBgcolor))
    }, [])



    const station = {
        name: "Liked Songs",
        imgUrl: LikedSongLogo,
        clips: user.likedSongs,
        createdBy: {
            fullname: user.fullname
        }
    }

    const onHandleDragEnd = (res) => {
        clips = handleDragEnd(res, clips)
        setClips(clips)
        user.likedSongs = clips
        dispatch(updateUser(user))
    }

    // const onPlayClip = (clip) => {
    //     dispatch(setClip(clip))
    //     dispatch(setPlaylist(station))
    //     dispatch(updateUser(user))
    // }

    
    const onTogglePlay = async (clip, isClicked) => {
        console.log('clip', clip)
        if (!isClicked) {
            dispatch(setIsPlaying(false))
            clearInterval(mediaPlayerInterval)
            dispatch(setPlaylist(station))
            dispatch(setClip(clip))
            dispatch(setMediaPlayerInterval(setInterval(getTime, 750)))
            playerFunc.playVideo()
        }
        if (isClicked) {
            clearInterval(mediaPlayerInterval)
            playerFunc.pauseVideo()
        }
        dispatch(setIsPlaying(!isPlaying))
    }

    const getTime = async () => {
        const time = await playerFunc.getCurrentTime()
        storageService.put('currTime', time)
        dispatch(setCurrTime(time))
        if (currTime > clipLength - 1.5) {
            const currIdx = currPlaylist.clips.indexOf(currClip)
            let nextIdx = currIdx + 1
            if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
            currClip = currPlaylist.clips[nextIdx]
        }
        dispatch(setClip(currClip))
        dispatch(setIsPlaying(true))
    }


    return (
        <div className='my-sd-container'>
            <div className='my-sd-header'>
                <StationHeader
                    bgColor={likedSongsBgcolor}
                    isUserStation={true}
                    LikedSongLogo={LikedSongLogo}
                    clips={station.clips}
                    station={station}
                    user={user.username}
                    LikedSongsLogo={LikedSongsLogo}
                    onTogglePlay={onTogglePlay}
                />
            </div>
            <div className='station-clips-container'>
                <ClipListHeader
                    bgColor={likedSongsBgcolor}
                />
                <hr />
                <DragDropContext onDragEnd={onHandleDragEnd}>
                    <Droppable droppableId='station-clips-main-container'>
                        {(provided) => (
                            <DraggableClipList
                                bgColor={likedSongsBgcolor}
                                provided={provided}
                                clipKey={'liked-clip'}
                                station={station}
                                clips={station.clips}
                            />)}
                    </Droppable>
                </DragDropContext>
            </div>
        </div >
    )



}