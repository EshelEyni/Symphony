import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { EditModal } from './edit-modal'
import { Dropdown } from './dropdown'
import { LikeIcon } from './like-icon'
import { Equalizer } from './equalizer'
import { updateStation } from '../store/station.actions'
import { setMediaPlayerClip, setPlaylist } from '../store/media-player.actions'
import { uploadImg } from '../services/upload.service'
import { setBackgroundColor } from '../services/bg-color.service'
import { stationService } from '../services/station.service'
import { defaultImg } from '../services/user.service'
import { DropdownBtn } from './dropdown-btn'

export const StationHeader = ({
    currStation,
    isLikedSongs,
    LikedSongsLogo,
    setBgcolor,
    onRemoveStation,
    onSaveSearchStation,
    onTogglePublicStation,
    isAdminMode,
    setAdminMode }) => {

    const { isPlaying, currPlaylist, togglePlayFunc } = useSelector(state => state.mediaPlayerModule)
    const { loggedinUser } = useSelector(state => state.userModule)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [imgUrl, setImgUrl] = useState(currStation.imgUrl)
    const [isChangedImg, setIsChangedImg] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const dropdownBtnRef = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!currPlaylist) return
        if (currStation._id === currPlaylist?._id) setIsClicked(isPlaying)
        else setIsClicked(false)
    }, [currPlaylist, currStation, isPlaying])

    useEffect(() => {
        setImgUrl(currStation.imgUrl)
    }, [currStation])

    const onTogglePlay = () => {
        if (!isClicked && currStation._id !== currPlaylist?._id) {
            dispatch(setPlaylist(currStation))
            dispatch(setMediaPlayerClip(currStation.clips[0]))
        }
        togglePlayFunc()
    }

    const onUploadImg = async (ev) => {
        if (!ev.target.value) return
        const stationToUpdate = { ...currStation }
        setIsChangedImg(true)
        setImgUrl(defaultImg)
        stationToUpdate.imgUrl = await uploadImg(ev)
        setImgUrl(stationToUpdate.imgUrl)
        setIsChangedImg(false)
        await setBackgroundColor(stationToUpdate, setBgcolor)
        dispatch(updateStation(stationToUpdate))
    }


    if (currStation)
        return (
            <header className='station-header'>
                <section
                    className='station-header-title flex'>
                    {<div className='station-img-container'>
                        <label htmlFor='station-header-img'>
                            {!isChangedImg &&
                                <img
                                    className='station-img '
                                    src={LikedSongsLogo || imgUrl}
                                    alt='playist-img' />}
                            {isChangedImg &&
                                <img
                                    className={'station-img ' + (imgUrl === defaultImg ? 'rotate' : '')}
                                    src={imgUrl}
                                    alt='playist-img' />}
                        </label>
                        {(currStation.createdBy._id === loggedinUser?._id && !isLikedSongs) &&
                            <input
                                className='img-input'
                                id='station-header-img'
                                onChange={onUploadImg} type='file' />}
                    </div>}

                    <section className='sh-title'>
                        <h5>Playlist</h5>
                        <h1 className='station-name'>{currStation.name}</h1>
                        <p >{currStation.desc}</p>

                        <div >
                            <p className='station-header-details'>
                                <Link to={'/profile/' + currStation.createdBy._id}
                                    className='user-name'>
                                    {currStation.createdBy.username}
                                </Link>
                                {stationService.setDetails(currStation)}
                                {currStation.likedByUsers?.length > 0 && <Link
                                    to={'/station-like-profiles/' + currStation._id}>
                                    {` ● ${currStation.likedByUsers.length} likes`}
                                </Link>}
                            </p>
                        </div>
                    </section>
                </section>

                <section className='playlist-btns'>
                    {currStation.clips?.length > 0 && <div className='play-btn-container'>
                        <button
                            className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                            onClick={onTogglePlay}></button>
                        {(currStation._id === currPlaylist?._id && isPlaying) && <Equalizer />}
                    </div>}

                    {loggedinUser?.isAdmin &&
                        <span
                            className='admin-state-btn'
                            onClick={() => setAdminMode(!isAdminMode)}
                        >⭐</span>}

                    <DropdownBtn
                        dropdownBtnRef={dropdownBtnRef}
                        name={currStation?.name}
                        setIsDropdown={setIsDropdown}
                        isDropdown={isDropdown}
                    />

                    {(loggedinUser && !isLikedSongs) &&
                        <LikeIcon
                            currStation={currStation}
                            isStationHeader={true}
                            inputId={currStation._id}
                        />}
                </section>

                {isDropdown && <Dropdown
                    leftPos={dropdownBtnRef.current.offsetLeft + 45}
                    currStation={currStation}
                    isDropdown={isDropdown}
                    setIsDropdown={setIsDropdown}
                    setIsEdit={setIsEdit}
                    isAdminMode={isAdminMode}
                    isUserStation={currStation.createdBy._id === loggedinUser?._id}
                    isStationDropdown={true}
                    onTogglePublicStation={onTogglePublicStation}
                    onSaveSearchStation={onSaveSearchStation}
                    onRemoveStation={onRemoveStation}
                />}

                {isEdit && <EditModal
                    currStation={currStation}
                    setIsEdit={setIsEdit}
                    setMainImg={setImgUrl}
                    setBgcolor={setBgcolor}
                />}
            </header >
        )
}