import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { StationList } from "../cmps/station-list"
import { getStationByTag } from "../services/station.service"
import { utilService } from "../services/util.service"

export const TagsDetails = () => {
    let stations = useSelector(state => state.stationModule.stations)

    const params = useParams()
    return <div
        className='tag-preview-container flex column'>
        <h1>{params.title}</h1>
        <div className="tag-details-container">
            <StationList stations={getStationByTag(stations, params.title)} />
        </div>
    </div>
}