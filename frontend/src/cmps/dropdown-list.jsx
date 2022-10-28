import { useSelector, useDispatch } from 'react-redux'
import { updateStation } from '../store/station.actions'
import { setUserMsg, updateUser } from '../store/user.actions'
import { userService } from '../services/user.service'

export const DropdownList = ({
    clip,
    onAddClip
}) => {
    const { loggedinUser } = useSelector(state => state.userModule)
    // const {stations} = useSelector(state => state.stationModule)
    const stations = useSelector(state => state.stationModule.stations).filter(station => station.createdBy?._id === loggedinUser?._id && !station.isSearch)
    // change this to normal convention

    return <ul className='dropdown-list'>
        {stations.map(station => <li
            key={station._id}
            value={station.id}
            onClick={() => onAddClip(clip, station._id)}
        >{station.name}
        </li>)}
    </ul>
}

