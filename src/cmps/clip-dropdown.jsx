import { useState } from "react"
import { useSelector } from "react-redux"

export const ClipDropdown = ({ clip, station, onRemoveClip }) => {
    const user = useSelector(state => state.userModule.user)
    const [isShare, setIsShare] = useState(false)

    const miniMediaPlayer = ''

    

    return (
        <ul
            className='dropdown-clip'>
            {station?.createdBy?._id === user?._id && <li
                onClick={(ev) => onRemoveClip(ev, clip._id, clip.title)}>Remove from this playlist</li>}
            <ul onClick={() => setIsShare(!isShare)}>Share
                <li>Copy Song Link</li>
                <li onClick={() => { navigator.clipboard.writeText(miniMediaPlayer) }}>Embed Track</li>
            </ul>

        </ul>

    )
}


