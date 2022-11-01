import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Loader } from "../cmps/loader"
import { StationList } from "../cmps/station-list"
import { stationService } from "../services/station.service"
import { loadArtist } from "../store/artist.actions"
import { loadStations } from "../store/station.actions"

export const ArtistStations = () => {
    const { watchedArtist } = useSelector(state => state.artistModule)
    const { stations } = useSelector(state => state.stationModule)
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (!watchedArtist) dispatch(loadArtist(params._id))
        if (!stations.length) dispatch(loadStations())

    }, [watchedArtist])

    if (!watchedArtist)
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )

    if (watchedArtist)
        return (
            <section className="artist-stations">
                <StationList
                    title={'Playlits for ' + watchedArtist.username}
                    stations={stationService.getFilteredStations(stations, { term: watchedArtist.username, type: 'artist-name' })}
                    stationKey={'artists-stations-station '}
                />
            </section>
        )
}