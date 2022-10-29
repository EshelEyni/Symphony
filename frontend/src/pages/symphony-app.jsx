import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from '../cmps/loader.jsx'
import { ProfileList } from '../cmps/profile-list.jsx'
import { StationList } from '../cmps/station-list.jsx'
import { loadArtists } from '../store/artist.actions.js'
import { setGetStationsByTag, setTags } from '../store/station.actions.js'
import { artistService } from '../services/artist.service.js'
import { stationService } from '../services/station.service.js'

export const SymphonyApp = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { stations, tags, getStationByTag } = useSelector(state => state.stationModule)
    const { artists } = useSelector(state => state.artistModule)
    const [randomArtists, setRandomArtists] = useState(null)
    const [artistsByLike, setArtistsByLike] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (stations.length) dispatch(setGetStationsByTag(stations))
        if (!tags.length) dispatch(setTags(stationService.getTags()))
        if (!artists.length) dispatch(loadArtists())
        if (artists.length > 0 && !randomArtists && !artistsByLike) {
            setRandomArtists(artistService.getRandomArtists(artists))
            setArtistsByLike(artistService.getArtistBylikes(artists, loggedinUser))
        }
    }, [stations, artists])
    
    if (!getStationByTag?.getByTag || !randomArtists)
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )

    if (getStationByTag?.getByTag && randomArtists)
        return (
            <main>
                <section className='artists-main-container'>
                    <h1>Artists</h1>
                    <ProfileList
                        profiles={randomArtists}
                        profileKey={'hp-artists-'} />

                    {artistsByLike?.length > 0 && <section>
                        <h1>Artists you might like</h1>
                        <ProfileList
                            isArtistByLike={true}
                            isLimitedDisplay={true}
                            profiles={artistsByLike}
                            profileKey={'hp-artists-by-like-'} />
                    </section>}
                </section>

                <section>{tags.map(tag => (
                    <section
                        className='station-by-tag-container'
                        key={tag.name}
                    >
                        <header className='tag-header-container'>
                            <h1>{tag.name}</h1>
                        </header>
                        <StationList
                            stations={getStationByTag.getByTag(tag.name)}
                            tag={tag.name}
                            isLimitedDisplay={true}
                            stationKey={'hp-' + tag.name + '-station-'}
                        />
                    </section>
                ))}</section>
            </main >
        )
}