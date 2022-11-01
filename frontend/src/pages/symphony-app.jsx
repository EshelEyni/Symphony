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
    const [artistsByLike, setArtistsByLike] = useState(null)
    const dispatch = useDispatch()

    console.log('SYMPHONY_APP')

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (stations.length) dispatch(setGetStationsByTag(stations))
        if (!tags.length) dispatch(setTags(stationService.getTags()))
        if (!artists.length) dispatch(loadArtists())
        if (artists.length > 0 && !artistsByLike) {
            setArtistsByLike(artistService.getArtistBylikes(artists, loggedinUser))
        }
    }, [stations, artists])

    if (!getStationByTag?.getByTag || !artists.length)
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )

    if (getStationByTag?.getByTag && artists.length > 0)
        return (
            <main>
                <section className='artists-main-container'>
                    <ProfileList
                        title={'Artists'}
                        profiles={artists}
                        isLimitedDisplay={true}
                        isRandomArtist={true}
                        profileKey={'hp-artists-'} />

                    {artistsByLike?.length > 0 && <section>
                        <ProfileList
                            title={'Artists you might like'}
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
                        <StationList
                            title={tag.name}
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