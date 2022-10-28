import { useSelector } from 'react-redux'
import { stationService } from '../services/station.service'

export const DropdownStationList = ({
    setIsDropdown,
    clip,
    onAddClip

}) => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { stations } = useSelector(state => state.stationModule)

    return <ul className='dropdown-list'>
        {stationService.getUserStations(stations, loggedinUser, 'user-stations').map(station => <li
            key={'dropdown-list-station-' + station._id}
            onClick={() => {
                setIsDropdown(false)
                onAddClip(clip, station._id)
            }}
        >{station.name}
        </li>)}
    </ul>
}

