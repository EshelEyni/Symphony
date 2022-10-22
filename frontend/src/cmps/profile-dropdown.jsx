import { userService } from "../services/user.service"

export const ProfileDropdown = ({
    setIsDropdown,
    isDropdown,
    setIsEdit,
    isEdit,
    isLoggedInUserProfile,
    watchedProfileId,
    onToggleFollowProfile,
    isFollowedProfile,
    setIsFollowedProfile }) => {

    return (
        <ul className='dropdown-profile'>

            {/************************** Personal Profile Features **************************/}
            {isLoggedInUserProfile &&
                <li
                    onClick={() => {
                        setIsDropdown(!isDropdown)
                        setIsEdit(!isEdit)
                    }}
                >Edit profile</li>
            }

            {/************************** Profile Features **************************/}
            {!isLoggedInUserProfile &&
                <li onClick={() => {
                    onToggleFollowProfile(watchedProfileId)
                    setIsFollowedProfile(!isFollowedProfile)
                }}>
                    {isFollowedProfile ? 'Unfollow' : 'Follow'}
                </li>}
            {isLoggedInUserProfile && <li onClick={() => userService.remove(watchedProfileId)}>Delete Acount</li>}
            <li onClick={() => navigator.clipboard.writeText('http://localhost:3000/#/user-profile/' + watchedProfileId)}>Copy link to profile</li>
        </ul>

    )
}


