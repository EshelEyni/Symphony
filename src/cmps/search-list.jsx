import React from 'react'
import { useDispatch } from 'react-redux'
import { getDate } from '../services/clip.service'
import { clearMsg, msg, userService } from '../services/user.service'
import { updateStation } from '../store/station.actions'
import { setUserMsg, updateUser } from '../store/user.actions'
import { SearchResult } from './search-result'
import { useSelector } from 'react-redux'


export function SearchList({
    currStation,
    setCurrStation,
    searchClips,
    type,
    onPlayClip,
    setCurrStationsClips }) {

    const dispatch = useDispatch()

    const onAddClip = async (addedClip, currStation) => {
        if (currStation.clips.find(clip => clip._id === addedClip._id)) {
            dispatch(setUserMsg(msg(addedClip.title, ' Is already in ', currStation.name)))
            setTimeout(async () => {
                dispatch(setUserMsg(clearMsg))
            }, 2500);
            return
        }
        const stationToUpdate = { ...currStation }
        addedClip.createdAt = new Date(getDate()).toLocaleDateString()
        stationToUpdate.clips.push(addedClip)
        setCurrStation(stationToUpdate)
        setCurrStationsClips(stationToUpdate.clips)
        dispatch(updateStation(currStation))
        dispatch(setUserMsg(msg(addedClip.title, ' added to ' + currStation.name)))
        setTimeout(async () => {
            dispatch(setUserMsg(clearMsg))
        }, 2500);
    }

    return (
        <ul className='search-res-container flex'>
            {searchClips.map((clip, idx) => <SearchResult
                key={type + idx}
                type={type}
                idx={idx}
                clip={clip}
                currStation={currStation}
                onPlayClip={onPlayClip}
                setCurrStation={setCurrStation}
                onAddClip={onAddClip}
            />)}
        </ul>
    )
}