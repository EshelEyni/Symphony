import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown } from './dropdown'
import { EditModal } from './edit-modal'
import { updateUser, updateWatchedUser } from '../store/user.actions'
import { uploadImg } from '../services/upload.service'
import { setBackgroundColor } from '../services/bg-color.service'
import { defaultImg } from '../services/user.service'
import { updateArtist } from '../store/artist.actions'
import { setMediaPlayerClip, setPlaylist } from '../store/media-player.actions'
import { socketService, SOCKET_EVENT_USER_UPDATED } from '../services/socket.service'
import { setHeaderBgcolor } from '../store/app-header.actions'
import { DropdownBtn } from './dropdown-btn'

export const ProfileHeader = ({
    watchedUser,
    loggedinUser,
    publicStations
}) => {

    const { isPlaying, currPlaylist, togglePlayFunc } = useSelector(state => state.mediaPlayerModule)
    const [profileImgUrl, setProfileImgUrl] = useState(watchedUser.imgUrl)
    const [isChangedImg, setIsChangedImg] = useState(false)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isFollowedProfile, setIsFollowedProfile] = useState(checkIsFollowedProfile())
    const [isClicked, setIsClicked] = useState(false)
    const dropdownBtnRef = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!currPlaylist) return
        if (watchedUser._id === currPlaylist?._id) setIsClicked(isPlaying)
        else setIsClicked(false)
    }, [currPlaylist, watchedUser, isPlaying])

    const onTogglePlay = () => {
        if (!isClicked && watchedUser._id !== currPlaylist?._id) {
            dispatch(setPlaylist(watchedUser))
            dispatch(setMediaPlayerClip(watchedUser.clips[0]))
        }
        togglePlayFunc()
    }


    useEffect(() => {
        setIsFollowedProfile(checkIsFollowedProfile())
        setProfileImgUrl(watchedUser.imgUrl)
    }, [watchedUser, isFollowedProfile])

    function checkIsFollowedProfile() {
        if (!loggedinUser) return
        return (loggedinUser.following.includes(watchedUser._id))
    }

    const onUploadImg = async (ev) => {
        if (!loggedinUser) return
        const userToUpdate = { ...loggedinUser }
        setIsChangedImg(true)
        setProfileImgUrl(defaultImg)
        userToUpdate.imgUrl = await uploadImg(ev)
        setProfileImgUrl(userToUpdate.imgUrl)
        setIsChangedImg(false)
        await setBackgroundColor(userToUpdate)
        dispatch(setHeaderBgcolor(userToUpdate.bgColor))
        dispatch(updateUser(userToUpdate))
        socketService.emit(SOCKET_EVENT_USER_UPDATED, userToUpdate)
    }

    const onToggleFollowProfile = async () => {
        const watchedUserToUpdate = { ...watchedUser }

        if (isFollowedProfile) {
            loggedinUser.following = loggedinUser.following.filter(currId => currId !== watchedUser._id)
            watchedUserToUpdate.followers = watchedUserToUpdate.followers.filter(currId => currId !== loggedinUser._id)
        }
        else {
            loggedinUser.following.push(watchedUser._id)
            watchedUserToUpdate.followers.push(loggedinUser._id)
        }

        dispatch(updateUser(loggedinUser))
        watchedUserToUpdate?.isArtist ? dispatch(updateArtist(watchedUserToUpdate)) : dispatch(updateWatchedUser(watchedUserToUpdate))
    }

    const getProfileDetails = () => {
        const { _id, followers, following } = watchedUser
        return (
            <div className='personal-details-container'>
                <Link to={'/public-playlists/' + watchedUser._id}>
                    {(publicStations?.length > 0 ? publicStations?.length + ' Public Playlists ' : '')}
                </Link>
                <Link to={'/followers/' + _id}>
                    {(followers?.length > 0 ? ' ● ' + followers?.length + ' Followers ' : '')}
                </Link>
                <Link to={'/following/' + _id}>
                    {(following?.length > 0 ? ' ● ' + following?.length + ' Following ' : '')}
                </Link>
            </div>
        )
    }

    return (
        <header
            className='profile-header'>
            <main
                className='profile-header-main-container'>
                <div className='profile-header-img-container'>
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
                    {loggedinUser?._id === watchedUser._id && <input
                        className='img-input'
                        id='profile-img'
                        onChange={onUploadImg} type='file' />}
                </div>

                <div className='profile-header-details flex column'>
                    <p className='profile-title'>{watchedUser.isArtist ? 'ARTIST' : 'PROFILE'}</p>
                    <h1 className='profile-name'>{watchedUser?.username}</h1>
                    {getProfileDetails()}
                </div>
            </main>

            <section
                className='profile-btn-container'>
                <div className='profile-btn-main-container flex'>
                    {(watchedUser.clips?.length > 0 && watchedUser?.isArtist) && <button
                        className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={onTogglePlay} />}

                    {(loggedinUser && loggedinUser?._id !== watchedUser?._id) &&
                        <button
                            className='toggle-follow-btn'
                            onClick={onToggleFollowProfile}
                        >{isFollowedProfile ? 'Following' : 'Follow'}</button>}

                    <DropdownBtn
                        dropdownBtnRef={dropdownBtnRef}
                        name={watchedUser?.name}
                        setIsDropdown={setIsDropdown}
                        isDropdown={isDropdown}
                    />
                </div>

                {isDropdown && <Dropdown
                    leftPos={dropdownBtnRef.current.offsetLeft + 45}
                    isDropdown={isDropdown}
                    setIsDropdown={setIsDropdown}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    isProfileDropDown={true}
                    isFollowedProfile={isFollowedProfile}
                    setIsFollowedProfile={setIsFollowedProfile}
                    onToggleFollowProfile={onToggleFollowProfile}
                />}

                {isEdit && <EditModal
                    user={watchedUser}
                    setMainImg={setProfileImgUrl}
                    setIsEdit={setIsEdit}
                />}
            </section>
        </header>
    )
}