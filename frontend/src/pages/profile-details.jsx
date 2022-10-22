import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { ProfileHeader } from '../cmps/profile-header'
import { ClipList } from '../cmps/clip-list'
import { StationList } from '../cmps/station-list'
import { ProfileList } from '../cmps/profile-list'
import { Loader } from '../cmps/loader'
import { loadStations } from '../store/station.actions'
import { loadUser, loadUsers } from '../store/user.actions'
import { setHeaderBgcolor } from '../store/app-header.actions'
import { loadArtists } from '../store/artist.actions'
import { userService } from '../services/user.service'
import { profileService } from '../services/profile-service'
import { stationService } from '../services/station.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, USER_REGISTERED_TO_PROFILE } from '../services/socket.service'
import { defaultHeaderBgcolor } from '../services/bg-color.service'


export const ProfileDetails = () => {
    const loggedinUser = userService.getLoggedinUser()
    const { user, users } = useSelector(state => state.userModule)
    const { artists } = useSelector(state => state.artistModule)
    const { stations } = useSelector(state => state.stationModule)
    const [publicStations, setPublicStations] = useState(stationService.getUserStations(stations, user, 'public-stations') || [])
    const [recentlyPlayedClips, setRecentlyPlayedClips] = useState(user?.recentlyPlayed?.clips || [])
    const [profilesByLike, setProfilesByLike] = useState([])

    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        if (user?._id !== params._id) {
            dispatch(loadUser(params._id))
        }
    }, [params])

    useEffect(() => {
        dispatch(loadUsers())
        dispatch(loadStations())
        dispatch(loadArtists())
    }, [])

    useEffect(() => {
        const currStations = stationService.getUserStations(stations, user, 'public-stations')
        setPublicStations(currStations)
        setProfilesByLike(profileService.getUserProfiles(users, loggedinUser, 'likes'))
        dispatch(setHeaderBgcolor(user?.bgColor))
    }, [stations, users, user])


    useEffect(() => {
        socketService.emit(USER_REGISTERED_TO_PROFILE, user?._id)
        return () => {
            socketService.off(USER_REGISTERED_TO_PROFILE)
            socketService.off(SOCKET_EVENT_USER_UPDATED)
            dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        }
    }, [])


    if (!user) {
        return <Loader
            size={'large-loader'}
            loaderType={'page-loader'} />
    }

    if (user) {
        return (
            <section className='profile-details'>
                <main className='profile-details-main-container flex column'>
                    <ProfileHeader
                        userMadePublicStations={publicStations}
                        user={user}
                        loggedinUser={loggedinUser}
                    />

                    {/******************************** Personal Profile Content ********************************/}

                    {loggedinUser?._id === params._id &&
                        <section className='personal-profile-content'>
                            {recentlyPlayedClips?.length > 0 &&
                                <section
                                    className='recently-played-container'
                                // style={{ backgroundColor: user.bgColor }}
                                >
                                    <h1>Recently Played</h1>
                                    <ClipList
                                        bgColor={user.bgColor}
                                        clipKey={'recently-played'}
                                        currStation={user.recentlyPlayed}
                                        currClips={user.recentlyPlayed.clips}
                                        setCurrClips={setRecentlyPlayedClips}
                                        isRecentlyPlayed={true}
                                    />

                                </section>}
                            {profilesByLike.length > 0 &&
                                <section className='shared-liked-music'>
                                    <h1>People who like the same music</h1>
                                    <ProfileList
                                        currProfiles={profilesByLike}
                                        profileKey={'profiles-by-like-'}

                                    />
                                </section>}
                        </section>}


                    {/******************************** Profile Content  ********************************/}

                    {publicStations.length > 0 &&
                        <section className='personal-playlist'>
                            <h1>{user.username} Playlists</h1>
                            <Link to={'/tag/Top songs'}>SEE ALL</Link>
                            <StationList
                                stations={publicStations}
                                stationKey={'profile-details-station-'}
                            />
                        </section>}

                    {user.followers.length > 0 &&
                        <section className='followers-container'>
                            <h1>Followers</h1>
                            <ProfileList
                                currProfiles={profileService.getUserProfiles(users, user, 'followers')}
                                profileKey={'profile-followers-'}
                            />
                        </section>}

                    {user.following.length > 0 &&
                        <section className='following-container'>
                            <h1>Following</h1>
                            <ProfileList
                                currProfiles={profileService.getUserProfiles(users, user, 'following', artists)}
                                profileKey={'profiles-followers-'}
                            />
                        </section>}


                    <hr className='profile-hr' />

                    <h1>PROFILES FOR CHECK - DELETE IN THE END</h1>
                    <ProfileList
                        currProfiles={users}
                        profileKey={'deme-profiles-'}
                    />

                </main>
            </section>
        )
    }
}