import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown } from './dropdown'
import { EditModal } from './edit-modal'
import { updateUser, updateWatchedUser } from '../store/user.actions'
import { uploadImg } from '../services/upload.service'
import { setBackgroundColor } from '../services/bg-color.service'
import { defaultImg } from '../services/user.service'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { updateArtist } from '../store/artist.actions'
import { setMediaPlayerClip, setPlaylist } from '../store/media-player.actions'
import { Equalizer } from './equalizer'

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
        dispatch(updateUser(userToUpdate))
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
        if (!watchedUser) return
        const { _id, followers, following } = watchedUser
        return (
            <div>
                {(publicStations?.length > 0 ? publicStations?.length + ' Public Playlists ' : '')}
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
            className='profile-header'
            style={{ backgroundColor: watchedUser?.bgColor }}>
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
                    {loggedinUser?._id === watchedUser._id && <input
                        className='profile-img-input'
                        id='profile-img'
                        onChange={onUploadImg} type='file' />}
                </section>
                <section className='profile-header-details flex column'>
                    <p>{watchedUser.isArtist ? 'ARTIST' : 'PROFILE'}</p>
                    <h1 className='profile-h1'>{watchedUser?.username}</h1>
                    {getProfileDetails()}
                </section>
            </main>

            <section
                className='profile-btn-container'>
                <section className='profile-btn-main-container flex'>
                    {(watchedUser.clips?.length > 0 && watchedUser?.isArtist) && <section className='play-btn-container'>
                        <button
                            className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                            onClick={onTogglePlay}></button>
                        {(watchedUser._id === currPlaylist?._id && isPlaying) && <Equalizer />}

                    </section>}
                    {(loggedinUser && loggedinUser?._id !== watchedUser?._id) &&
                        <button
                            className='toggle-follow-btn'
                            onClick={onToggleFollowProfile}
                        >{isFollowedProfile ? 'Following' : 'Follow'}</button>}

                    <section
                        className='dropdown-btn-container flex'
                        title={'More options for ' + watchedUser?.username}
                        onClick={() => setIsDropdown(!isDropdown)}>
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