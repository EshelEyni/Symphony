import { useState } from "react"
import { useSelector } from "react-redux"
import { DropDownList } from './drop-down-list'


export const ClipDropdown = ({ clip, station, onRemoveClip }) => {

    const user = useSelector(state => state.userModule.user)
    const [isShare, setIsShare] = useState(false)
    const miniMediaPlayer = ''

    return (
        <div className='dropdown-clip'>
            <ul>
                {station?.createdBy?._id === user._id && <li class="remove-clip" onClick={(ev) => onRemoveClip(ev, clip._id, clip.title)}>Remove from playlist</li>}
                <li onClick={() => setIsShare(!isShare)}>Share</li>
                <li>Copy Song Link</li>
                <li onClick={() => { navigator.clipboard.writeText(miniMediaPlayer) }}>Embed Track</li>
            </ul>
            <ul class="add-to-station">Add to playlist
                <DropDownList clip={clip} />
            </ul>
        </div >

    )
}


