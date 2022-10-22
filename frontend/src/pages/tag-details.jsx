import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { StationList } from "../cmps/station-list"
import { stationService } from "../services/station.service"

export const TagsDetails = () => {
    let stations = useSelector(state => state.stationModule.stations)

    const params = useParams()
    return <div>
        <h1>{params.title}</h1>
        <div>
            <StationList stations={stationService.getStationByTag(stations, params.title)} />
        </div>
    </div>
}