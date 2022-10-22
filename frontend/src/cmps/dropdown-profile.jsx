import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { UserMsg } from "./user-msg"
import { onLogout } from "../store/user.actions"
import { userService } from "../services/user.service"

export const DropdownProfile = ({
    isDropdown,
    setIsDropdown,
    isEdit,
    setIsEdit,
    isDeleteClicked,
    setIsDeleteClicked,
    isProfileDropDown,
    isLoggedInUserProfile,
    watchedProfileId,
    isFollowedProfile,
    setIsFollowedProfile,
    onToggleFollowProfile,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onRemoveUser = async () => {
        dispatch(onLogout())
        await userService.remove(watchedProfileId)
        navigate('/')
    }

    return (
        <div>
            {isLoggedInUserProfile &&
                <div>
                    <li
                        onClick={() => {
                            setIsDropdown(!isDropdown)
                            setIsEdit(!isEdit)
                        }}
                    >Edit profile</li>
                    <li onClick={() => setIsDeleteClicked(true)}>Delete Acount</li>

                    {isDeleteClicked && <div className='shadow-screen confirm-delete-profile'
                        onClick={() => setIsDeleteClicked(false)}></div>}
                    {isDeleteClicked && <UserMsg
                        isProfileDropDown={isProfileDropDown}
                        isDeleteMsg={true}
                        setIsDeleteClicked={setIsDeleteClicked}
                        onRemoveUser={onRemoveUser}
                    />}
                </div>}

            {!isLoggedInUserProfile &&
                <li onClick={() => {
                    onToggleFollowProfile()
                    setIsFollowedProfile(!isFollowedProfile)
                }}>
                    {isFollowedProfile ? 'Unfollow' : 'Follow'}
                </li>}
        </div>
    )

}