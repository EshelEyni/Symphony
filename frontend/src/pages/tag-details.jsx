import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Loader } from '../cmps/loader'
import { StationList } from '../cmps/station-list'
import { setGetStationsByTag } from '../store/station.actions'

export const TagsDetails = () => {
    const { stations, getStationByTag } = useSelector(state => state.stationModule)
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        if (stations.length && !getStationByTag?.getByTag)
            dispatch(setGetStationsByTag(stations))
    }, [stations])

    if (!getStationByTag?.getByTag) {
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )
    }

    if (getStationByTag?.getByTag) {
        return <section>
            <h1>{params.title}</h1>
            <section>
                <StationList
                    stations={getStationByTag.getByTag(params.title)}
                    stationKey={'tag-details-station-'}
                />
            </section>
        </section>
    }
}