import React from 'react'
import { useDispatch } from 'react-redux'
import { getDate } from '../services/clip.service'
import { clearMsg, msg, userService } from '../services/user.service'
import { updateStation } from '../store/station.actions'
import { setUserMsg, updateUser } from '../store/user.actions'
import { SearchResult } from './search-result'
import { useSelector } from 'react-redux'


export function SearchList({ station, setStation, clips, type, onPlayClip, playtlistClips }) {
    const user = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()

    const onAddClip = (addedClip) => {
        if (station.clips.find(clip => clip._id === addedClip._id)) {
            dispatch(setUserMsg(msg(addedClip.title, ' Is already in ', station.name)))
            setTimeout(async () => {
                dispatch(setUserMsg(clearMsg))
            }, 2500);
            return
        }
        addedClip.createdAt = new Date(getDate()).toLocaleDateString()
        station.clips.push(addedClip)
        setStation({ ...station })
        dispatch(updateStation(station))

        // userService.updateUserStation(user, station)
        // dispatch(updateUser(user))

        dispatch(setUserMsg(msg(addedClip.title, ' added to ' + station.name)))
        setTimeout(async () => {
            dispatch(setUserMsg(clearMsg))
        }, 2500);
    }

    return (
        <ul className='search-res-container flex'>
            {clips.map((clip, idx) => <SearchResult
                key={type + idx}
                type={type}
                idx={idx}
                clip={clip}
                playtlistClips={playtlistClips}
                onPlayClip={onPlayClip}
                onAddClip={onAddClip}
            />)}
        </ul>
    )
}