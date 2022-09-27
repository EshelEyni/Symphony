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

export const ProfileHeader = ({ user, setUser }) => {
    const loggedInUser = useSelector(state => state.userModule.user)
    let stations = useSelector(state => state.stationModule.stations)

    const [imgUrl, setImgUrl] = useState(user.imgUrl)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isFollowedProfile, setIsFollowedProfile] = useState(checkIsFollowedProfile())
    const dispatch = useDispatch()

    const users = useSelector(state => state.userModule.users)


    const isLoggedInUserProfile = loggedInUser._id === user._id

    useEffect(() => {
        dispatch(setHeaderBgcolor(profileBgcolor))
    }, [])

    function checkIsFollowedProfile() {
        if (loggedInUser?.following?.find(profileId => profileId === user?._id)) return true
        return false
    }

    const onUploadImg = async (ev) => {
        setImgUrl(defaultImg)
        const currImgUrl = await uploadImg(ev)
        setImgUrl(currImgUrl)
        user.imgUrl = currImgUrl
        dispatch(updateUser(user))
    }

    const onToggleFollowProfile = () => {
        const loggedInUserId = loggedInUser._id
        const watchedProfileId = user._id // user is the watched profile user
        if (isFollowedProfile) {
            loggedInUser.following = loggedInUser.following.filter(currId => currId !== watchedProfileId)
            dispatch(updateUser(loggedInUser))
            user.followers = user.followers.filter(currId => currId !== loggedInUserId)
            dispatch(updateFollowers(user))
        }
        if (!isFollowedProfile) {
            loggedInUser.following.push(watchedProfileId)
            user.followers.push(loggedInUserId)
            dispatch(updateFollowers(user))
            dispatch(updateUser(loggedInUser))
        }
    }


    return <div className='profile-header'>
        <div
            className='profile-header-main-container flex'>
            {<div className='pl-img-container'>
                <label htmlFor='profile-img'>
                    <img
                        className={'profile-img ' + checkLoading(imgUrl)}
                        src={imgUrl ? imgUrl : pic}
                        alt='profile-img' />
                </label>
                <input
                    className='profile-img-input'
                    id='profile-img'
                    onChange={onUploadImg} type='file' />
            </div>}
            <div className='profile-details'>
                <p>Profile</p>
                <h1 className='profile-h1'>{user.fullname}</h1>
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
                watchedProfileId={user._id}
                isDropdown={isDropdown}
                setIsDropdown={setIsDropdown}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                isLoggedInUserProfile={isLoggedInUserProfile}

            />}

            {isEdit && <ProfileEdit
                user={user}
                setUser={setUser}
                setIsDropdown={setIsDropdown}
                setIsEdit={setIsEdit}
                setMainImg={setImgUrl}
            />}
        </div>
    </div>
}