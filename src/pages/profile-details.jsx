import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  useParams } from 'react-router-dom'
import { ProfileHeader } from '../cmps/profile-header'
import { DraggableClipList } from '../cmps/draggable-clip-list'
import { setClip, setPlaylist } from '../store/media-player.actions'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { handleDragEnd } from '../services/dragg.service'
import { ClipListHeader } from '../cmps/clip-list-header'
import { ProfilesList } from '../cmps/profile-list'
import { userService } from '../services/user.service'
import { loadStations } from '../store/station.actions'
import { storageService } from '../services/async-storage.service'
import { StationList } from '../cmps/station-list'


export const UserProfile = () => {
    const loggedInUser = useSelector(state => state.userModule.user)
    let stations = useSelector(state => state.stationModule.stations)
    let [user, setUser] = useState()
    let [userMadeStations, setUserMadeStations] = useState([])
    const params = useParams()
    let [recentlyPlayedClips, setRecentlyPlayedClips] = useState()
    const dispatch = useDispatch()


    useEffect(() => {
        loadUser(user, params.id)
        dispatch(loadStations())
    }, [params])

    useEffect(() => {
        const currStations = stations.filter(station => station.createdBy._id === user?._id && !station.isSearch)
        setUserMadeStations(currStations)
    }, [stations])

    const loadUser = async (user, paramsId) => {
        if (paramsId) {
            user = await userService.getById(paramsId)
        } else {
            user = userService.getLoggedinUser()
        }
        const recentlyPlayed = storageService.loadFromStorage('recentlyPlayed')
        setRecentlyPlayedClips(recentlyPlayed?.clips)
        console.log('recentlyPlayedClips', recentlyPlayedClips)
        setUser(user)
    }

    const onHandleDragEnd = (res) => {
        recentlyPlayedClips = handleDragEnd(res, recentlyPlayedClips)
        setRecentlyPlayedClips(recentlyPlayedClips)
        storageService.save('recentlyPlayed', {
            userId: loggedInUser._id, clips: recentlyPlayedClips
        })
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

                    {(loggedInUser._id === params.id && recentlyPlayedClips?.length > 0) &&
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
                                            clips={recentlyPlayedClips}
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
                    <div className="personal-playlist">
                        <h1>Personal-Playlist</h1>
                        <StationList
                            stations={userMadeStations}
                        />
                    </div>
                </div>}
        </div>
    )
}



