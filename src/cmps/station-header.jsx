import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { defaultImg } from "../services/station.service"
import { uploadImg } from "../services/upload.service"
import { updateStation } from "../store/station.actions"
import { StationDropdown } from "./station-dropdown"
import { StationEdit } from "./station-edit"
import { HeaderDetails } from "./header-details"
import { computeColor } from "../services/bg-color.service"
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from "../store/media-player.actions"
import { storageService } from "../services/async-storage.service"
import { updateUser } from "../store/user.actions"
import { userService } from "../services/user.service"

export const StationHeader = ({
    currStation,
    setCurrStation,
    isUserStation,
    LikedSongLogo,
    imgUrl,
    setImgUrl,
    bgColor,
    setBgcolor,
    onRemoveStation,
    onSaveSearchStation,
    isAdminMode,
    setAdminMode }) => {
    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)

    const loggedInUser = useSelector(state => state.userModule.user)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isChangedImg, setIsChangedImg] = useState(false)

    let [isClicked, setIsClicked] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!currClip || !currPlaylist) return
        if (currStation._id === currPlaylist._id) {
            setIsClicked(isPlaying)
        }
    }, [isPlaying])


    const onUploadImg = async (ev) => {
        const stationToUpdate = { ...currStation }
        setIsChangedImg(true)
        setImgUrl(defaultImg)
        const uploadedImgUrl = await uploadImg(ev)
        stationToUpdate.imgUrl = uploadedImgUrl
        setCurrStation(stationToUpdate)
        setImgUrl(uploadedImgUrl)
        computeColor(uploadedImgUrl)
            .then(color => {
                stationToUpdate.bgColor = color
                setBgcolor(color)
            })
            .catch(error => {
                console.log('failed to compute color for img: ' + error)
            })
        console.log('stationToUpdate', stationToUpdate)
        dispatch(updateStation(stationToUpdate))

        setIsChangedImg(false)
    }

    const onTogglePlay = async (clip, isClicked) => {

        if (!isClicked) {
            dispatch(setIsPlaying(false))
            clearInterval(mediaPlayerInterval)
            dispatch(setPlaylist(currStation))
            dispatch(setClip(clip))
            dispatch(setMediaPlayerInterval(setInterval(getTime, 750)))
            playerFunc.playVideo()
        }
        if (isClicked) {
            clearInterval(mediaPlayerInterval)
            playerFunc.pauseVideo()
        }
        dispatch(setIsPlaying(!isPlaying))
        const userToUpdate = { ...loggedInUser }
        userService.updateUserRecentlyPlayedClips(userToUpdate, clip)
        dispatch(updateUser(userToUpdate))
    }

    const getTime = async () => {
        const time = await playerFunc.getCurrentTime()
        storageService.put('currTime', time)
        dispatch(setCurrTime(time))
        if (currTime > clipLength - 1.5) {
            const currIdx = currPlaylist.clips.indexOf(currClip)
            let nextIdx = currIdx + 1
            if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
            currClip = currPlaylist.clips[nextIdx]
        }
        dispatch(setClip(currClip))
        dispatch(setIsPlaying(true))
    }

    const getCurrPlayedClip = () => {
        let clip = null
        if (currPlaylist._id === currStation?._id) clip = currClip
        else clip = currStation.clips[0]
        return clip
    }


    return <div className='station-header'>
        <div
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}
            className='station-header-main-container flex'>
            {<div className='pl-img-container'>
                <label htmlFor='pl-img'>
                    {!isChangedImg && <img
                        className='station-img '
                        src={LikedSongLogo ? LikedSongLogo : imgUrl}
                        alt='playist-img' />}
                    {isChangedImg &&
                        <img
                            className={'station-img ' + (imgUrl === defaultImg ? 'rotate' : '')}
                            src={LikedSongLogo ? LikedSongLogo : imgUrl}
                            alt='playist-img' />
                    }
                </label>
                {(isUserStation && !LikedSongLogo) &&
                    <input
                        className='img-input'
                        id='pl-img'
                        onChange={onUploadImg} type='file' />
                }</div>}

            <div className='station-header-details-container'>
                <h1 className='station-header-name-container'>{currStation.name}</h1>
                <div className='desc-container'>{currStation.desc}</div>
                {isUserStation ? <HeaderDetails
                    creator={currStation?.createdBy?.fullname} clips={currStation?.clips} /> :
                    <HeaderDetails
                        creator={currStation?.createdBy?.username} clips={currStation?.clips} />}
            </div>
        </div>
        <div className='playlist-btns'
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}>
            <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                onClick={() => {
                    setIsClicked(!isClicked)
                    onTogglePlay(getCurrPlayedClip(), isClicked)
                }}></button>
            {loggedInUser?.isAdmin &&
                <span
                    className="admin-state-btn"
                    onClick={() => setAdminMode(!isAdminMode)}
                >⭐</span>
            }
            <button className='dropdown-btn fa-solid fa-ellipsis' onClick={() => setIsDropdown(!isDropdown)}></button>
        </div>
        <div
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}
            className='pl-container'>
            {currStation._id !== 'liked-station' &&
                <div className="sd-btns-container">
                    {/* <LikesBtns /> */}
                </div>}

            {isDropdown && <StationDropdown
                isAdminMode={isAdminMode}
                isDropdown={isDropdown}
                stationId={currStation._id}
                isSearchStation={currStation?.isSearch}
                setIsDropdown={setIsDropdown}
                isUserStation={isUserStation}
                setIsEdit={setIsEdit}
                onRemoveStation={onRemoveStation}
                onSaveSearchStation={onSaveSearchStation}
            />}

            {isEdit && <StationEdit
                setIsEdit={setIsEdit}
                setCurrStation={setCurrStation}
                setBgcolor={setBgcolor}
                setMainImg={setImgUrl}
                currStation={currStation} />}
        </div>

    </div >
}