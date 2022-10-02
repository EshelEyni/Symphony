import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { uploadImg } from "../services/upload.service"
import pic from '../assets/img/blank-user.png'
import { profileBgcolor } from "../services/bg-color.service"
import { setHeaderBgcolor } from "../store/app-header.actions"
import { updateFollowers, updateUser } from "../store/user.actions"
import { checkLoading, defaultImg } from '../services/profile-service'
import { ProfileEdit } from "./profile-edit"
import { ProfileDropdown } from "./profile-dropdown"
import { useSelector } from "react-redux"
import { userService } from "../services/user.service"

export const ProfileHeader = ({
    watchedProfileUser,
}) => {
    const loggedInUser =userService.getLoggedinUser()
    const isLoggedInUserProfile = loggedInUser?._id === watchedProfileUser._id
    const [profileImgUrl, setProfileImgUrl] = useState()
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isFollowedProfile, setIsFollowedProfile] = useState(checkIsFollowedProfile())
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(profileBgcolor))
        setProfileImgUrl(watchedProfileUser.imgUrl)
    }, [watchedProfileUser])

    function checkIsFollowedProfile() {
        if (loggedInUser?.following?.find(profileId => profileId === watchedProfileUser?._id)) return true
        return false
    }

    const onUploadImg = async (ev) => {
        setProfileImgUrl(defaultImg)
        const currImgUrl = await uploadImg(ev)
        setProfileImgUrl(currImgUrl)
        watchedProfileUser.imgUrl = currImgUrl
        dispatch(updateUser(watchedProfileUser))
    }

    const onToggleFollowProfile = () => {
        const loggedInUserId = loggedInUser._id
        const watchedProfileId = watchedProfileUser._id 
        if (isFollowedProfile) {
            loggedInUser.following = loggedInUser.following.filter(currId => currId !== watchedProfileId)
            dispatch(updateUser(loggedInUser))
            watchedProfileUser.followers = watchedProfileUser.followers.filter(currId => currId !== loggedInUserId)
            dispatch(updateFollowers(watchedProfileUser))
        }
        if (!isFollowedProfile) {
            loggedInUser.following.push(watchedProfileId)
            watchedProfileUser.followers.push(loggedInUserId)
            dispatch(updateUser(watchedProfileUser))
            dispatch(updateFollowers(watchedProfileUser))
        }
    }


    return <div className='profile-header'>
        <div
            className='profile-header-main-container flex'>
            {<div className='pl-img-container'>
                <label htmlFor='profile-img'>
                    <img
                        className={'profile-img ' + checkLoading(profileImgUrl)}
                        src={profileImgUrl ? profileImgUrl : pic}
                        alt='profile-img' />
                </label>
                <input
                    className='profile-img-input'
                    id='profile-img'
                    onChange={onUploadImg} type='file' />
            </div>}
            <div className='profile-details'>
                <p>Profile</p>
                <h1 className='profile-h1'>{watchedProfileUser.fullname}</h1>
            </div>
        </div>

        <div
            className='dropdown-container'>
            <i
                onClick={() => {
                    setIsDropdown(!isDropdown)
                }}
                className='fa-solid fa-ellipsis'></i>

            {isDropdown && <ProfileDropdown
                onToggleFollowProfile={onToggleFollowProfile}
                isFollowedProfile={isFollowedProfile}
                setIsFollowedProfile={setIsFollowedProfile}
                watchedProfileId={watchedProfileUser._id}
                isDropdown={isDropdown}
                setIsDropdown={setIsDropdown}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                isLoggedInUserProfile={isLoggedInUserProfile}

            />}

            {isEdit && <ProfileEdit
                watchedProfileUser={watchedProfileUser}
                setIsDropdown={setIsDropdown}
                setIsEdit={setIsEdit}
                setMainImg={setProfileImgUrl}
            />}
        </div>
    </div>
}