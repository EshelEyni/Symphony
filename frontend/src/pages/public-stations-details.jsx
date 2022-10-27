import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Loader } from "../cmps/loader"
import { StationList } from "../cmps/station-list"
import { stationService } from "../services/station.service"
import { userService } from "../services/user.service"
import { loadStation } from "../store/station.actions"

export const PublicStationsDetails = () => {
    const { stations } = useSelector(state => state.stationModule)
    const [publicStations, setPublicStations] = useState([])
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!stations.length) dispatch(loadStation())
        getPublicStations()
    }, [])

    const getPublicStations = async () => {
        const user = await userService.getById(params._id)
        setPublicStations(stationService.getUserStations(stations, user, 'public-stations'))
    }

    if (!stations.length) {
        return <Loader
            size={'large-loader'}
            loaderType={'page-loader'} />
    }

    if (publicStations.length)
        return (
            <section className='public-stations-details'>
                <h1>Public Playlists</h1>
                <StationList
                    stations={publicStations}
                    stationKey={'public-playlists-station-'}
                    isPublicDetails={true}
                />
            </section>
        )
}