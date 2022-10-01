import { useState } from "react"
import { useSelector } from "react-redux"
import { DropDownList } from './drop-down-list'


export const ClipDropdown = ({ clip, station, onRemoveClip, setIsDropdownClip }) => {

    const loggedInUser = useSelector(state => state.userModule.user)
    const [isShare, setIsShare] = useState(false)
    const miniMediaPlayer = ''

    return (
        <div className='dropdown-clip'>
            <ul>
                {(station?.createdBy?._id === loggedInUser._id) || loggedInUser?.isAdmin && <li className="remove-clip" onClick={(ev) => {
                    setIsDropdownClip(false)
                    onRemoveClip(ev, clip._id, clip.title)
                }}>Remove from playlist</li>}
                <li onClick={() => setIsShare(!isShare)}>Share</li>
                <li>Copy Song Link</li>
                <li onClick={() => { navigator.clipboard.writeText(miniMediaPlayer) }}>Embed Track</li>
            </ul>
            <ul className="add-to-station">Add to playlist
                <DropDownList clip={clip} />
            </ul>
        </div >

    )
}


