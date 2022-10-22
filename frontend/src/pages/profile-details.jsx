import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ProfileHeader } from '../cmps/profile-header'
import { DraggableClipList } from '../cmps/draggable-clip-list'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { handleDragEnd } from '../services/dragg.service'
import { ClipListHeader } from '../cmps/clip-list-header'
import { ProfileList } from '../cmps/profile-list'
import { userService } from '../services/user.service'
import { loadStations } from '../store/station.actions'
import { StationList } from '../cmps/station-list'
import { loadUser, loadUsers, updateUser } from '../store/user.actions'
import { getFilteredUsersList } from '../services/profile-service'


export const UserProfile = () => {
    const loggedInUser = userService.getLoggedinUser()
    const watchedProfileUser = useSelector(state => state.userModule.user)
    const users = useSelector(state => state.userModule.users)
    let stations = useSelector(state => state.stationModule.stations)
    let [userMadeStations, setUserMadeStations] = useState([])
    const params = useParams()
    let [recentlyPlayedClips, setRecentlyPlayedClips] = useState([])
    const dispatch = useDispatch()


    useEffect(() => {
        const id = params.id
        dispatch(loadStations())
        dispatch(loadUsers())
        if (watchedProfileUser._id !== id) dispatch(loadUser(id))
    }, [params, watchedProfileUser])

    useEffect(() => {
        const currStations = stations.filter(station => station.createdBy._id === watchedProfileUser?._id && !station.isSearch)
        setUserMadeStations(currStations)
        setRecentlyPlayedClips(watchedProfileUser?.recentlyPlayedClips)
    }, [stations, watchedProfileUser])



    const onHandleDragEnd = (res) => {
        const clipsToUpdate = handleDragEnd(res, recentlyPlayedClips)
        setRecentlyPlayedClips(clipsToUpdate)
        watchedProfileUser.recentlyPlayedClips = clipsToUpdate
        dispatch(updateUser(watchedProfileUser))
    }


    return (
        <div className='user-profile-container'>
            {watchedProfileUser &&
                <div className='main-user-profile-container flex column'>
                    <ProfileHeader
                        watchedProfileUser={watchedProfileUser}
                    />

                    {/******************************** Personal Profile Content ********************************/}

                    {watchedProfileUser && (loggedInUser?._id === params.id) &&
                        <div className="personal-profile-content">
                            {recentlyPlayedClips?.length > 0 &&
                                <div className="recently-played-container">
                                    <h1>Recently Played</h1>
                                    <ClipListHeader />
                                    <DragDropContext onDragEnd={onHandleDragEnd}>
                                        <Droppable droppableId='station-clips-main-container'>
                                            {(provided) => (
                                                <DraggableClipList
                                                    // bgColor={bgColor}
                                                    provided={provided}
                                                    clipKey={'recently-played'}
                                                    // station={station}
                                                    currClips={recentlyPlayedClips}
                                                />)}
                                        </Droppable>
                                    </DragDropContext>
                                </div>}
                            <div className='shared-liked-music'>
                                <h1>People who like the same music</h1>
                                <ProfileList
                                    currProfiles={getFilteredUsersList(users, watchedProfileUser, 'likes')}
                                // currUser={watchedProfileUser}
                                // filterBy={'likes'}
                                />
                            </div>
                        </div>}


                    {/******************************** Profile Content  ********************************/}

                    <div className="followers-following-container">
                        <h1>Followers</h1>
                        <ProfileList
                            currProfiles={getFilteredUsersList(users, watchedProfileUser, 'followers')}
                        // currUser={watchedProfileUser}
                        // filterBy={'followers'}
                        />
                        <h1>Following</h1>
                        <ProfileList
                            currProfiles={getFilteredUsersList(users, watchedProfileUser, 'following')}
                        // currUser={watchedProfileUser}
                        // filterBy={'following'}
                        />
                    </div>
                    <div className="personal-playlist">
                        <h1>{watchedProfileUser.fullname} Playlists</h1>
                        <StationList
                            stations={userMadeStations}
                        />
                    </div>
                </div>}
        </div>
    )
}



