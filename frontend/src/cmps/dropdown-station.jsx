import { useSelector } from "react-redux"
import { ConfirmDeleteMsg } from "./confirm-delete-msg"

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

    const {loggedinUser} = useSelector(state => state.userModule)
    const isPublicStation = loggedinUser?.publicStations.includes(currStation?._id)

    return (
        <div>
            <li onClick={() => {
                setIsDropdown(!isDropdown)
                setIsEdit(!isEdit)
            }}>Edit</li>

            <li onClick={() => setIsDeleteClicked(true)}>Delete</li>

            {isDeleteClicked && <ConfirmDeleteMsg
                isUserStation={isUserStation}
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