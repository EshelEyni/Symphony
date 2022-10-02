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

export const ProfileHeader = ({ currProfileUser, setCurrProfileUser }) => {
    const loggedInUser = useSelector(state => state.userModule.user)
    const isLoggedInUserProfile = loggedInUser?._id === currProfileUser._id
    const [profileImgUrl, setProfileImgUrl] = useState()
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isFollowedProfile, setIsFollowedProfile] = useState(checkIsFollowedProfile())
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(setHeaderBgcolor(profileBgcolor))
        setProfileImgUrl(currProfileUser.imgUrl)
    }, [currProfileUser])

    function checkIsFollowedProfile() {
        if (loggedInUser?.following?.find(profileId => profileId === currProfileUser?._id)) return true
        return false
    }

    const onUploadImg = async (ev) => {
        setProfileImgUrl(defaultImg)
        const currImgUrl = await uploadImg(ev)
        setProfileImgUrl(currImgUrl)
        currProfileUser.imgUrl = currImgUrl
        dispatch(updateUser(currProfileUser))
    }

    const onToggleFollowProfile = () => {
        const loggedInUserId = loggedInUser._id
        const watchedProfileId = currProfileUser._id // user is the watched profile user
        if (isFollowedProfile) {
            loggedInUser.following = loggedInUser.following.filter(currId => currId !== watchedProfileId)
            dispatch(updateUser(loggedInUser))
            currProfileUser.followers = currProfileUser.followers.filter(currId => currId !== loggedInUserId)
            dispatch(updateFollowers(currProfileUser))
        }
        if (!isFollowedProfile) {
            loggedInUser.following.push(watchedProfileId)
            currProfileUser.followers.push(loggedInUserId)
            dispatch(updateFollowers(currProfileUser))
            dispatch(updateUser(loggedInUser))
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
                <p>PROFILE</p>
                <h1 className='profile-h1'>{currProfileUser.fullname}</h1>
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
                watchedProfileId={currProfileUser._id}
                isDropdown={isDropdown}
                setIsDropdown={setIsDropdown}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                isLoggedInUserProfile={isLoggedInUserProfile}

            />}

            {isEdit && <ProfileEdit
                currProfileUser={currProfileUser}
                setCurrProfileUser={setCurrProfileUser}
                setIsDropdown={setIsDropdown}
                setIsEdit={setIsEdit}
                setMainImg={setProfileImgUrl}
            />}
        </div>
    </div>
}