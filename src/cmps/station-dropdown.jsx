import { userService } from "../services/user.service"

export const StationDropdown = ({
    isDropdown,
    isSearchStation,
    setIsDropdown,
    stationId,
    isUserStation,
    isAdminMode,
    setIsEdit,
    onSaveSearchStation,
    onRemoveStation }) => {
    const loggedInUser = userService.getLoggedinUser()

    return (
        <ul className='station-dropdown'>
            {(isUserStation || loggedInUser?.isAdmin) &&
                <div>
                    <li onClick={() => {
                        setIsDropdown(!isDropdown)
                        setIsEdit(true)
                    }}>Edit</li>
                    <li onClick={() => onRemoveStation()}>Delete</li>
                    {isSearchStation &&
                        <li onClick={() => onSaveSearchStation()}>Save Playlist</li>}
                </div>
            }
            <li onClick={() => navigator.clipboard.writeText('http://localhost:3000/#/station/' + stationId)}>Share</li>
        </ul>

    )
}


