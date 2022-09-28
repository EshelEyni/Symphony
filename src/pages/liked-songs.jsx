import { useSelector, useDispatch } from 'react-redux'
import { setClip, setPlaylist } from '../store/media-player.actions.js'
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
import { setRecentlyPlayed, userService } from '../services/user.service.js'



export const LikedSongs = () => {
    const user = useSelector(state => state.userModule.user)
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

    const onPlayClip = (clip) => {
        dispatch(setClip(clip))
        dispatch(setPlaylist(station))
        dispatch(updateUser(user))
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
                />
            </div>
            <div className='ms-clips-container'>
                <ClipListHeader
                    bgColor={likedSongsBgcolor}
                />
                <hr />
                <DragDropContext onDragEnd={onHandleDragEnd}>
                    <Droppable droppableId='ms-clips-main-container'>
                        {(provided) => (
                            <DraggableClipList
                                bgColor={likedSongsBgcolor}
                                provided={provided}
                                clipKey={'liked-clip'}
                                station={station}
                                clips={station.clips}
                                onPlayClip={onPlayClip}
                            />)}
                    </Droppable>
                </DragDropContext>
            </div>
        </div >
    )



}