import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ProfileHeader } from '../cmps/profile-header'
import { ClipList } from '../cmps/clip-list'
import { StationList } from '../cmps/station-list'
import { ProfileList } from '../cmps/profile-list'
import { Loader } from '../cmps/loader'
import { loadStations } from '../store/station.actions'
import { loadUsers, setWatchedUser } from '../store/user.actions'
import { setHeaderBgcolor } from '../store/app-header.actions'
import { loadArtists } from '../store/artist.actions'
import { profileService } from '../services/profile-service'
import { stationService } from '../services/station.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, USER_REGISTERED_TO_PROFILE } from '../services/socket.service'
import { defaultHeaderBgcolor } from '../services/bg-color.service'


export const ProfileDetails = () => {
    const { watchedUser, loggedinUser, users } = useSelector(state => state.userModule)
    const { artists } = useSelector(state => state.artistModule)
    const { stations } = useSelector(state => state.stationModule)
    const [publicStations, setPublicStations] = useState(stationService.getUserStations(stations, watchedUser, 'public-stations') || [])
    const [recentlyPlayedClips, setRecentlyPlayedClips] = useState(loggedinUser?.recentlyPlayed?.clips || [])
    const [profilesByLike, setProfilesByLike] = useState([])

    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        dispatch(loadUsers())
        dispatch(loadStations())
        dispatch(loadArtists())
    }, [])

    useEffect(() => {
        dispatch(setHeaderBgcolor(watchedUser?.bgColor))
        if (watchedUser?._id !== params._id) dispatch(setWatchedUser(params._id))
        setPublicStations(stationService.getUserStations(stations, watchedUser, 'public-stations'))
        setProfilesByLike(profileService.getUserProfiles(users, loggedinUser, 'likes'))
    }, [params, stations, users, watchedUser])

    useEffect(() => {
        socketService.emit(USER_REGISTERED_TO_PROFILE, watchedUser?._id)
        return () => {
            socketService.off(USER_REGISTERED_TO_PROFILE)
            socketService.off(SOCKET_EVENT_USER_UPDATED)
            dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
            dispatch(setWatchedUser('clear-user'))
            setPublicStations([])
            setRecentlyPlayedClips([])
            setProfilesByLike([])
        }
    }, [])

    if (!watchedUser) {
        return <Loader
            size={'large-loader'}
            loaderType={'page-loader'} />
    }

    if (watchedUser) {
        return (
            <section className='profile-details'>
                <main className='profile-details-main-container flex column'>
                    <ProfileHeader
                        publicStations={publicStations}
                        watchedUser={loggedinUser && loggedinUser._id === watchedUser._id ? loggedinUser : watchedUser}
                        loggedinUser={loggedinUser}
                    />

                    {/******************************** Personal Profile Content ********************************/}

                    {loggedinUser?._id === params._id &&
                        <section className='personal-profile-content'>
                            {recentlyPlayedClips?.length > 0 &&
                                <section
                                    className='recently-played-container'>
                                    <h1>Recently Played</h1>
                                    <ClipList
                                        bgColor={loggedinUser.bgColor}
                                        clipKey={'recently-played'}
                                        currStation={loggedinUser.recentlyPlayed}
                                        currClips={loggedinUser.recentlyPlayed.clips}
                                        setCurrClips={setRecentlyPlayedClips}
                                        isRecentlyPlayed={true}
                                    />
                                </section>}
                            {profilesByLike.length > 0 &&
                                <section className='shared-liked-music'>
                                    <h1>People who like the same music</h1>
                                    <ProfileList
                                        profiles={profilesByLike}
                                        profileKey={'profiles-by-like-'}
                                    />
                                </section>}
                        </section>}


                    {/******************************** Profile Content  ********************************/}

                    {publicStations.length > 0 &&
                        <section className='personal-playlist'>
                            <h1>{watchedUser.username} Playlists</h1>
                            <StationList
                                stations={publicStations}
                                stationKey={'profile-details-station-'}
                                isLimitedDisplay={true}
                                watchedUserId={watchedUser._id}
                            />
                        </section>}

                    {watchedUser.followers.length > 0 &&
                        <section className='followers-container'>
                            <h1>Followers</h1>
                            <ProfileList
                                profiles={profileService.getUserProfiles(users, watchedUser, 'followers')}
                                isLimitedDisplay={true}
                                isFollowers={true}
                                profileKey={'profile-followers-'}
                            />
                        </section>}

                    {watchedUser.following.length > 0 &&
                        <section className='following-container'>
                            <h1>Following</h1>
                            <ProfileList
                                profiles={profileService.getUserProfiles(users, watchedUser, 'following', artists)}
                                isLimitedDisplay={true}
                                isFollowing={true}
                                profileKey={'profiles-following-'}
                            />
                        </section>}

                    <hr className='profile-hr' />
                </main>
            </section>
        )
    }
}