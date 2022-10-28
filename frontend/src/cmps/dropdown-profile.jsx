import { useDispatch, useSelector } from "react-redux"
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
    isFollowedProfile,
    setIsFollowedProfile,
    onToggleFollowProfile,
}) => {
    const { loggedinUser, watchedUser } = useSelector(state => state.userModule)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onRemoveUser = () => {
        dispatch(onLogout())
        navigate('/')
        userService.remove(watchedUser._id)
    }

    return (
        <div>
            {loggedinUser._id === watchedUser._id &&
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

            {loggedinUser._id !== watchedUser._id &&
                <li onClick={() => {
                    onToggleFollowProfile()
                    setIsFollowedProfile(!isFollowedProfile)
                }}>
                    {isFollowedProfile ? 'Unfollow' : 'Follow'}
                </li>}
        </div>
    )

}