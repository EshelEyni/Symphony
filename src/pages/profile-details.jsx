import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ProfileHeader } from '../cmps/profile-header'
import { DraggableClipList } from '../cmps/draggable-clip-list'
import { setClip, setPlaylist } from '../store/media-player.actions'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { handleDragEnd } from '../services/dragg.service'
import { ClipListHeader } from '../cmps/clip-list-header'
import { ProfileList } from '../cmps/profile-list'
import { userService } from '../services/user.service'
import { loadStations } from '../store/station.actions'
import { storageService } from '../services/async-storage.service'
import { StationList } from '../cmps/station-list'
import { updateUser } from '../store/user.actions'


export const UserProfile = () => {
    const loggedInUser = useSelector(state => state.userModule.user)
    let stations = useSelector(state => state.stationModule.stations)
    let [currProfileUser, setCurrProfileUser] = useState()
    let [userMadeStations, setUserMadeStations] = useState([])
    const params = useParams()
    let [recentlyPlayedClips, setRecentlyPlayedClips] = useState(loggedInUser.recentlyPlayedClips)
    const dispatch = useDispatch()

    console.log('loggedInUser', loggedInUser)

    useEffect(() => {
        loadUser(currProfileUser, params.id)
        dispatch(loadStations())
    }, [params])

    useEffect(() => {
        const currStations = stations.filter(station => station.createdBy._id === currProfileUser?._id && !station.isSearch)
        setUserMadeStations(currStations)
    }, [stations, loggedInUser])

    const loadUser = async (user, paramsId) => {
        if (paramsId !==loggedInUser._id) {
            user = await userService.getById(paramsId)
        } else {
            user = userService.getLoggedinUser()
        }
        setCurrProfileUser(user)
    }

    const onHandleDragEnd = (res) => {
        const clipsToUpdate = handleDragEnd(res,  loggedInUser.recentlyPlayedClips)
        setRecentlyPlayedClips(clipsToUpdate)
        loggedInUser.recentlyPlayedClips = clipsToUpdate
        dispatch(updateUser(loggedInUser))
    }


    return (
        <div className='user-profile-container'>
            {currProfileUser &&
                <div className='main-user-profile-container flex column'>
                    <ProfileHeader
                        user={currProfileUser}
                        setUser={setCurrProfileUser}
                    />

                    {/******************************** Personal Profile Content ********************************/}

                    {loggedInUser._id === params.id &&
                        <div className="personal-profile-content">
                            {loggedInUser.recentlyPlayedClips.length > 0 &&
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

                            <h1>People who like the same music</h1>
                            <ProfileList
                                currUser={loggedInUser}
                                filterBy={'likes'} />
                        </div>}


                    {/******************************** Profile Content  ********************************/}

                    <div className="followers-following-container">
                        <h1>Followers</h1>
                        <ProfileList
                            currUser={currProfileUser}
                            filterBy={'followers'}
                        />
                        <h1>Following</h1>
                        <ProfileList
                            currUser={currProfileUser}
                            filterBy={'following'}
                        />
                    </div>
                    <div className="personal-playlist">
                        <h1>{currProfileUser.fullname} Playlists</h1>
                        <StationList
                            stations={userMadeStations}
                        />
                    </div>
                </div>}
        </div>
    )
}



