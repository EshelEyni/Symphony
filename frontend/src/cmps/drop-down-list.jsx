import { useSelector } from "react-redux"
import { updateStation } from '../store/station.actions'
import { useDispatch } from "react-redux"
import { setUserMsg, updateUser } from "../store/user.actions"
import { clearMsg, msg, userService } from '../services/user.service'
import { getDate } from "../services/clip.service"



export const DropDownList = ({ clip }) => {
    const user = useSelector(state => state.userModule.user)
    const stations = useSelector(state => state.stationModule.stations).filter(station => station.createdBy._id === user._id && !station.isSearch)
    const dispatch = useDispatch()

    const onAddClip = (addedClip, stationId) => {
        const targetStation = stations.find(station => stationId === station._id)
        if (targetStation.clips.find(clip => clip._id === addedClip._id)) {
            dispatch(setUserMsg(msg(addedClip.title, ' Is already in ', targetStation.name)))
            setTimeout(async () => {
                dispatch(setUserMsg(clearMsg))
            }, 2500);
            return
        }
        addedClip.createdAt = new Date(getDate()).toLocaleDateString()
        targetStation.clips.push(addedClip)
        dispatch(updateStation(targetStation))
        userService.updateUserStation(user, targetStation)
        dispatch(updateUser(user))
        dispatch(setUserMsg(msg(addedClip.title, ' added to ' + targetStation.name)))
        setTimeout(async () => {
            dispatch(setUserMsg(clearMsg))
        }, 2500);
    }

    return <div className="dropdown-list">
        {stations.map(station => <li onClick={() => onAddClip(clip, station._id)} key={station._id} value={station.id}>{station.name}</li>)}
    </div>
}

