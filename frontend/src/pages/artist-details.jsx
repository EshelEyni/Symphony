import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ClipList } from '../cmps/clip-list'
import { Loader } from '../cmps/loader'
import { ProfileHeader } from '../cmps/profile-header'
import { ProfileList } from '../cmps/profile-list'
import { StationList } from '../cmps/station-list'
import { setHeaderBgcolor } from '../store/app-header.actions'
import { loadUsers } from '../store/user.actions'
import { loadStations } from '../store/station.actions'
import { profileService } from '../services/profile-service'
import { stationService } from '../services/station.service'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { loadArtist } from '../store/artist.actions'

export const ArtistDetails = () => {
    const { loggedinUser, users } = useSelector(state => state.userModule)
    const { stations } = useSelector(state => state.stationModule)
    const { watchedArtist } = useSelector(state => state.artistModule)
    const [currClips, setCurrClips] = useState(watchedArtist?.clips || [])
    const [stationsByArtist, setStationsByArtist] = useState([])
    const [profilesByArtist, setProfilesByArtist] = useState([])
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        dispatch(loadUsers())
        dispatch(loadStations())
        return () => {
            dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
            dispatch(loadArtist('clear-artist'))
            setCurrClips([])
            setStationsByArtist([])
            setProfilesByArtist([])
        }
    }, [])

    useEffect(() => {
        dispatch(setHeaderBgcolor(watchedArtist?.bgColor))
        if (watchedArtist?._id !== params._id) dispatch(loadArtist(params._id))
        if (watchedArtist && users.length > 0 && stations.length > 0) {
            setStationsByArtist(stationService.getFilteredStations(stations, { term: watchedArtist.username, type: 'artist-name' }))
            setProfilesByArtist(profileService.getProfilesByArtist(stations, users, watchedArtist.username) || [])
            setCurrClips(watchedArtist.clips || [])
        }

    }, [params, stations, users, watchedArtist])

    if (!watchedArtist) {
        return <Loader
            size={'large-loader'}
            loaderType={'page-loader'} />
    }

    if (watchedArtist) {
        return (
            <main className='artist-details'
                style={{ backgroundColor: watchedArtist.bgColor ? watchedArtist.bgColor : '#121212' }}>
                <ProfileHeader
                    watchedUser={watchedArtist}
                    loggedinUser={loggedinUser}
                />
                <section className='artist-clips-container'>
                    <ClipList
                        bgColor={watchedArtist.bgColor}
                        clipKey={'artist-clip'}
                        isStation={true}
                        currStation={watchedArtist}
                        currClips={currClips}
                        setCurrClips={setCurrClips}
                    />
                </section>
                {stationsByArtist.length > 0 &&
                    <section className='artist-stations-container'>
                        <StationList
                            title={'Playlists'}
                            isArtist={true}
                            isLimitedDisplay={true}
                            stations={stationsByArtist}
                            stationKey={'artists-details-station '}
                        />
                    </section>
                }

                {profilesByArtist.length > 0 && <section
                    className='artist-profile-list'>
                    <ProfileList
                        title={'Profiles'}
                        isArtistDetails={true}
                        isLimitedDisplay={true}
                        profiles={profilesByArtist}
                        profileKey={'artist-profile-'}
                    />
                </section>}
            </main>
        )
    }
}