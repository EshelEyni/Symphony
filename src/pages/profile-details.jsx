import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updateUser } from '../store/user.actions'
import { ProfileHeader } from '../cmps/profile-header'
import { DraggableClipList } from '../cmps/draggable-clip-list'
import { playClip, setPlaylist } from '../store/media-player.actions'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { handleDragEnd } from '../services/dragg.service'
import { ClipListHeader } from '../cmps/clip-list-header'
import { ProfilesList } from '../cmps/profile-list'
import { userService } from '../services/user.service'


export const UserProfile = () => {
    const loggedInUser = useSelector(state => state.userModule.user)
    const users = useSelector(state => state.userModule.users)
    let [user, setUser] = useState()
    const params = useParams()
    let [clips, setClips] = useState(user?.recentlyPlayed)
    const dispatch = useDispatch()

    useEffect(() => {
        loadUser(user, params.id)
    }, [params])

    const loadUser = async (user, paramsId) => {
        if (paramsId) {
            user = await userService.getById(paramsId)
        } else {
            user = userService.getLoggedinUser()
        }
        setClips(user.recentlyPlayed)
        setUser(user)
    }

    const onPlayClip = (clip) => {
        dispatch(playClip(clip))
        dispatch(setPlaylist(user.recentlyPlayed))
    }

    const onHandleDragEnd = (res) => {
        clips = handleDragEnd(res, clips)
        setClips(clips)
        user.recentlyPlayed = clips
        dispatch(updateUser(user))
    }


    return (
        <div className='user-profile-container'>
            {user &&
                <div className='main-user-profile-container flex column'>
                    <ProfileHeader
                        user={user}
                        setUser={setUser}
                    />

                    {/******************************** Personal Profile Content ********************************/}

                    {loggedInUser._id === params.id &&
                        <div className="personal-profile-content">
                            <h1>Recently Played</h1>
                            <ClipListHeader />
                            <DragDropContext onDragEnd={onHandleDragEnd}>
                                <Droppable droppableId='ms-clips-main-container'>
                                    {(provided) => (
                                        <DraggableClipList
                                            // bgColor={bgColor}
                                            provided={provided}
                                            clipKey={'recently-played'}
                                            // station={station}
                                            clips={clips}
                                            onPlayClip={onPlayClip}
                                        />)}
                                </Droppable>
                            </DragDropContext>

                            <h1>People who like the same music</h1>
                            <ProfilesList
                                filterBy={'likes'} />
                        </div>}


                    {/******************************** Profile Content  ********************************/}

                    <div className="followers-following-container">
                        <h1>Followers</h1>
                        <ProfilesList
                            filterBy={'followers'}
                        />
                        <h1>Following</h1>
                        <ProfilesList
                            filterBy={'following'}
                        />
                    </div>

                </div>}
        </div>
    )
}



