import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Loader } from "../cmps/loader"
import { StationList } from "../cmps/station-list"
import { stationService } from "../services/station.service"
import { userService } from "../services/user.service"
import { loadStations } from "../store/station.actions"

export const PublicStationsDetails = () => {
    const { stations } = useSelector(state => state.stationModule)
    const { user, watchedUser } = useSelector(state => state.userModule)
    const [publicStations, setPublicStations] = useState([])
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (!stations.length) dispatch(loadStations())
        getPublicStations()
    }, [stations])

    const getPublicStations = async () => {
        const user = await getUser()
        setPublicStations(stationService.getUserStations(stations, user, 'public-stations'))
    }

    const getUser = async () => {
        switch (params._id) {
            case user?._id:
                return user
            case watchedUser?._id:
                return watchedUser
            default:
                return await userService.getById(params._id)
        }
    }

    if (!publicStations.length) {
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
                />
            </section>
        )
}