import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown } from './dropdown'
import { EditModal } from './edit-modal'
import { updateUser } from '../store/user.actions'
import { uploadImg } from '../services/upload.service'
import { setBackgroundColor } from '../services/bg-color.service'
import { defaultImg, userService } from '../services/user.service'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

export const ProfileHeader = ({
    user,
    // loggedinUser,
    userMadePublicStations,
    isArtist
}) => {
    const loggedinUser = userService.getLoggedinUser()
    const isLoggedinUserProfile = loggedinUser?._id === user?._id

    const [profileImgUrl, setProfileImgUrl] = useState(user?.imgUrl)
    const [isChangedImg, setIsChangedImg] = useState(false)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isFollowedProfile, setIsFollowedProfile] = useState(checkIsFollowedProfile())
    const dispatch = useDispatch()

    useEffect(() => {
        setIsFollowedProfile(checkIsFollowedProfile())
    }, [user, isFollowedProfile])

    function checkIsFollowedProfile() {
        if (!loggedinUser) return
        return (loggedinUser.following.includes(user?._id))
    }

    const onUploadImg = async (ev) => {
        if (!loggedinUser) return
        const userToUpdate = { ...loggedinUser }
        setIsChangedImg(true)

        setProfileImgUrl(defaultImg)
        // const uploadedImgUrl = await uploadImg(ev)
        userToUpdate.imgUrl = await uploadImg(ev)
        setProfileImgUrl(userToUpdate.imgUrl)
        setIsChangedImg(false)
        await setBackgroundColor(userToUpdate)
        dispatch(updateUser(userToUpdate))
    }

    const onToggleFollowProfile = async () => {
        const watchedUserToUpdate = { ...user }

        if (isFollowedProfile) {
            loggedinUser.following = loggedinUser.following.filter(currId => currId !== user._id)
            watchedUserToUpdate.followers = watchedUserToUpdate.followers.filter(currId => currId !== loggedinUser._id)
        }

        if (!isFollowedProfile) {
            loggedinUser.following.push(user._id)
            watchedUserToUpdate.followers.push(loggedinUser._id)
        }

        await userService.update(loggedinUser)
        dispatch(updateUser(watchedUserToUpdate))
    }

    const getProfileDetails = () => {
        if (!user) return
        const { _id, followers, following } = user

        return (
            <div>
                {(userMadePublicStations?.length > 0 ? userMadePublicStations?.length + ' Public Playlists ' : '')}
                <Link to={'/followers/' + _id}>
                    {(followers?.length > 0 ? ' ● ' + followers?.length + ' Followers ' : '')}
                </Link>
                <Link to={'/following/' + _id}>
                    {(following?.length > 0 ? ' ● ' + following?.length + ' Following ' : '')}
                </Link>
            </div>
        )
    }
    return <header
        className='profile-header'
        style={{ backgroundColor: user?.bgColor }}
    >
        <main
            className='profile-header-main-container flex'>
            <section className='profile-img-container'>
                <label htmlFor='profile-img'>
                    {!isChangedImg && <img
                        className='profile-img '
                        src={profileImgUrl}
                        alt='profile-img' />}
                    {isChangedImg &&
                        <img
                            className={'profile-img ' + (profileImgUrl === defaultImg ? 'rotate' : '')}
                            src={profileImgUrl}
                            alt='profile-img' />}
                </label>
                {isLoggedinUserProfile && <input
                    className='profile-img-input'
                    id='profile-img'
                    onChange={onUploadImg} type='file' />}
            </section>
            <section className='profile-header-details flex column'>
                <p>{isArtist ? 'ARTIST' : 'PROFILE'}</p>
                <h1 className='profile-h1'>{user?.username}</h1>
                <p className='profile-header-details'>
                    {user?.isAdmin && <span
                        title='This user is an Symphony Admin'
                    >⭐ </span>}
                </p>
                {getProfileDetails()}
            </section>
        </main>

        <section
            className='profile-btn-container'>
            <section className='profile-btn-main-container flex'>
                {/* {!isLoggedinUserProfile && */}
                {(loggedinUser && loggedinUser?._id !== user?._id) &&
                    <button
                        className='toggle-follow-btn'
                        onClick={() => onToggleFollowProfile()}
                    >{isFollowedProfile ? 'Following' : 'Follow'}</button>}
                <section
                    className='dropdown-btn-container flex'
                    title={'More options for ' + user?.username}
                    onClick={() => { setIsDropdown(!isDropdown) }}>

                    <FiberManualRecordIcon sx={{ fontSize: '7.5px' }} />
                    <FiberManualRecordIcon sx={{ fontSize: '7.5px' }} />
                    <FiberManualRecordIcon sx={{ fontSize: '7.5px' }} />
                </section>
            </section>

            {isDropdown && <Dropdown
                isDropdown={isDropdown}
                setIsDropdown={setIsDropdown}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                isProfileDropDown={true}
                isLoggedInUserProfile={isLoggedinUserProfile}
                watchedProfileId={user?._id}
                isFollowedProfile={isFollowedProfile}
                setIsFollowedProfile={setIsFollowedProfile}
                onToggleFollowProfile={onToggleFollowProfile}
            />}

            {isEdit && <EditModal
                user={user}
                setMainImg={setProfileImgUrl}
                setIsEdit={setIsEdit}
            />}
        </section>
    </header>
}