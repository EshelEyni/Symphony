import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DropdownStationList } from "./dropdown-station-list"
import { setUserMsg } from "../store/user.actions"
import { setPlaylist } from '../store/media-player.actions'
import { loadArtists } from '../store/artist.actions'

export const DropdownClip = ({
    setIsDropdown,
    isAdminMode,
    currClip,
    onRemoveClip,
    onAddClip,
}) => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { currStation } = useSelector(state => state.stationModule)
    const { artists } = useSelector(state => state.artistModule)
    const { currMediaPlayerClip, currPlaylist } = useSelector(state => state.mediaPlayerModule)
    const [isAddClip, setIsAddClip] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!artists.length) dispatch(loadArtists())
    }, [artists])

    const onGoToArtist = () => {
        const artistId = artists.find(artist => artist.username === currClip.artist)?._id
        if (!artistId) {
            dispatch(setUserMsg('Artist page not available'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
        }
        else navigate('/artist/' + artistId)
    }

    const addToQueue = () => {
        const clipAlreadyInQueue = currPlaylist.clips.map(clip => clip._id).includes(currClip._id)
        if (clipAlreadyInQueue) {
            dispatch(setUserMsg('This song is already in Queue'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
        }
        else {
            const currMediaPlayerClipIdx = currPlaylist.clips.findIndex(clip => clip._id === currMediaPlayerClip._id)
            const stationToUpdate = { ...currPlaylist }
            stationToUpdate.clips.splice(currMediaPlayerClipIdx + 1, 0, currClip)
            dispatch(setPlaylist(stationToUpdate))
            dispatch(setUserMsg('Song added to Queue'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
        }
    }

    return (
        <div className='dropdown-clip'>
            <li onClick={addToQueue}>Add to queue</li>
            <li onClick={onGoToArtist}>Go to artist</li>
            {(currStation.createdBy._id === loggedinUser?._id || isAdminMode) && <li
                className='remove-clip'
                onClick={(ev) => {
                    setIsDropdown(false)
                    onRemoveClip(ev, currClip._id, currClip.title)
                }}
            >Remove from playlist</li>}

            <li onClick={() => setIsAddClip(!isAddClip)}>Add to playlist</li>

            {isAddClip &&
                <ul className='add-to-station'>
                    <DropdownStationList
                        setIsDropdown={setIsDropdown}
                        clip={currClip}
                        onAddClip={onAddClip}
                    />
                </ul>}

        </div>
    )
}