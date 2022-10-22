import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClipList } from '../cmps/clip-list'
import { Loader } from '../cmps/loader'
import { ProfileHeader } from '../cmps/profile-header'
import { ProfileList } from '../cmps/profile-list'
import { StationList } from '../cmps/station-list'
import { artistService } from '../services/artist.service'
import { profileService } from '../services/profile-service'
import { stationService } from '../services/station.service'
import { userService } from '../services/user.service'

export const ArtistDetails = () => {
    const loggedinUser = userService.getLoggedinUser()
    const [currArtist, setCurrArtist] = useState()
    const [stationsByArtist, setStationsByArtist] = useState([])
    const [profilesByArtist, setProfilesByArtist] = useState([])
    const params = useParams()

    useEffect(() => {
        loadArtist(params)
    }, [params])

    const loadArtist = async (params) => {
        const currArtist = await artistService.getById(params._id)
        const stations = await stationService.query() // load from store
        const users = await userService.getUsers() // load from store
        setCurrArtist(currArtist)
        setStationsByArtist(stationService.getFilteredStations(stations, { term: currArtist.username, type: 'artist-name' }))
        setProfilesByArtist(profileService.getProfilesByArtist(stations, users, currArtist.username))
    }

    if (!currArtist) {
        return <Loader
            size={'large-loader'}
            loaderType={'page-loader'} />
    }

    if (currArtist) {
        return (
            <main className='artist-details-container'>
                <ProfileHeader
                    watchedUser={currArtist}
                    loggedinUser={loggedinUser}
                    isArtist={true}
                />
                <section className='artist-clips-container'>
                    <ClipList
                        //  bgColor={stationBgcolor}
                        clipKey={'artist-clip'}
                        //  isUserCreatedStation={isUserCreatedStation}
                        isStation={true}
                        currStation={currArtist}
                        currClips={currArtist?.clips}
                        setCurrStation={setCurrArtist}
                    //  onRemoveClip={onRemoveClip}
                    />
                </section>
                {stationsByArtist.length > 0 &&
                    <section className='artist-stations-container'>
                        <h1>Playlists</h1>
                        <StationList
                            stations={stationsByArtist}
                            stationKey={'artists-details-station '}
                        />
                    </section>
                }

                {profilesByArtist.length > 0 && <section
                    className='artist-profile-list'>
                    <h1>Profiles</h1>
                    <ProfileList
                        currProfiles={profilesByArtist}
                        profileKey={'artist-profile-'}
                    />
                </section>}

            </main>
        )
    }
}