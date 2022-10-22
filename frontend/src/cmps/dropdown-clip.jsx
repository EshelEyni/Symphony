import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DropdownList } from "./dropdown-list"
import { setUserMsg } from "../store/user.actions"
import { setPlaylist } from '../store/media-player.actions'

export const DropdownClip = ({
    setIsDropdown,
    isAdminMode,
    isUserClip,
    currClip,
    onRemoveClip,
    onAddClip,
    artists


 }) => {
    const { currMediaPlayerClip, currPlaylist } = useSelector(state => state.mediaPlayerModule)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const onGoToArtist = () => {
        const artistId = artists.find(artist => artist.username === currClip.artist)?._id
        if (!artistId) {
            dispatch(setUserMsg('Artist page not available'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
            return
        }
        navigate('/artist/' + artistId)
    }

    const addToQueue = () => {
        const clipAlreadyInQueue = currPlaylist.clips.map(clip => clip._id).includes(currClip._id)
        if (clipAlreadyInQueue) {
            dispatch(setUserMsg('This clip is already in Queue'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
            return
        }

        const currMediaPlayerClipIdx = currPlaylist.clips.findIndex(clip => clip._id === currMediaPlayerClip._id)
        const stationToUpdate = { ...currPlaylist }
        stationToUpdate.clips.splice(currMediaPlayerClipIdx + 1, 0, currClip)
        dispatch(setPlaylist(stationToUpdate))
    }

    return (
        <div>
            <li onClick={addToQueue}>Add to queue</li>
            <li onClick={onGoToArtist}>Go to artist</li>
            {(isUserClip || isAdminMode) && <li
                className='remove-clip'
                onClick={(ev) => {
                    setIsDropdown(false)
                    onRemoveClip(ev, currClip._id, currClip.title)
                }}
            >Remove from playlist</li>}

            <ul className='add-to-station'>Add to playlist
                <DropdownList
                    clip={currClip}
                    onAddClip={onAddClip}
                />
            </ul>

        </div>
    )
}