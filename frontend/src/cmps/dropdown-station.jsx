import { userService } from "../services/user.service"
import { UserMsg } from "./user-msg"

export const DropdownStation = ({
    isDropdown,
    setIsDropdown,
    isEdit,
    setIsEdit,
    isDeleteClicked,
    setIsDeleteClicked,
    currStation,
    isUserStation,
    onSaveSearchStation,
    onTogglePublicStation,
    onRemoveStation,
}) => {

    const loggedinUser = userService.getLoggedinUser()
    const isPublicStation = loggedinUser?.publicStations.includes(currStation?._id)

    return (
        <div>
            <li onClick={() => {
                setIsDropdown(!isDropdown)
                setIsEdit(!isEdit)
            }}>Edit</li>

            <li onClick={() => setIsDeleteClicked(true)}>Delete</li>

            {isDeleteClicked && <UserMsg
                isUserStation={isUserStation}
                isDeleteMsg={true}
                setIsDeleteClicked={setIsDeleteClicked}
                onRemoveStation={onRemoveStation} />}

            {currStation.isSearch &&
                <li onClick={() => {
                    onSaveSearchStation()
                    setIsDropdown(!isDropdown)
                }}>Save Playlist</li>}

            <li onClick={() => {
                onTogglePublicStation()
                setIsDropdown(!isDropdown)
            }}>{isPublicStation ? 'Remove from profile' : 'Add to profile'}</li>
        </div>
    )
}