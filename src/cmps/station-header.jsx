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

export const StationHeader = ({
    station,
    setStation,
    isUserStation,
    LikedSongLogo,
    imgUrl,
    setImgUrl,
    bgColor,
    setBgcolor,
    onRemoveStation,
    onSaveSearchStation = { onSaveSearchStation },
    onTogglePlay,
    isAdminMode,
    setAdminMode }) => {

    let { currPlaylist, currClip, isPlaying } = useSelector(state => state.mediaPlayerModule)
    const user = useSelector(state => state.userModule.user)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isChangedImg, setIsChangedImg] = useState(false)

    let [isClicked, setIsClicked] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!currClip || !currPlaylist) return
        if (station._id === currPlaylist._id) {
            setIsClicked(isPlaying)
        }
    }, [isPlaying])

    const getCurrPlayedClip = () => {
        let clip = null
        if (currPlaylist._id === station._id) clip = currClip
        else clip = station.clips[0]
        return clip
    }

    useEffect(() => {
        // setImgUrl(imgUrl)
        // setBgcolor(station.bgColor)
    }, [station])

    const onUploadImg = async (ev) => {
        const stationToUpdate = { ...station }
        setIsChangedImg(true)
        setImgUrl(defaultImg)
        const uploadedImgUrl = await uploadImg(ev)
        stationToUpdate.imgUrl = uploadedImgUrl
        setImgUrl(uploadedImgUrl)
        computeColor(uploadedImgUrl)
            .then(color => {
                stationToUpdate.bgColor = color
                setBgcolor(color)
                dispatch(updateStation(stationToUpdate))
            })
            .catch(error => {
                console.log('failed to compute color for img: ' + error)
            })
        setIsChangedImg(false)
    }

    return <div className='my-sd-header'>
        <div
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}
            className='my-sd-header-main-container flex'>
            {<div className='pl-img-container'>
                <label htmlFor='pl-img'>
                    {!isChangedImg && <img
                        className={'station-img '}
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
                <p>TYPE OF STATION - TO FIX</p>
                <h1 className='station-header-name-container'>{station.name}</h1>
                <div className='desc-container'>{station.desc}</div>
                {isUserStation ? <HeaderDetails
                    creator={station?.createdBy?.fullname} clips={station?.clips} /> :
                    <HeaderDetails
                        creator={station?.createdBy?.username} clips={station?.clips} />}
            </div>
        </div>
        <div className='playlist-btns'
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}>
            <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                onClick={() => {
                    setIsClicked(!isClicked)
                    onTogglePlay(getCurrPlayedClip(), isClicked)
                }}></button>
            {user?.isAdmin &&
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
            {station._id !== 'liked-station' &&
                <div className="sd-btns-container">
                    {/* <LikesBtns /> */}
                </div>}

            {isDropdown && <StationDropdown
                isAdminMode={isAdminMode}
                isDropdown={isDropdown}
                isSearchStation={station?.isSearch}
                setIsDropdown={setIsDropdown}
                isUserStation={isUserStation}
                setIsEdit={setIsEdit}
                onRemoveStation={onRemoveStation}
                onSaveSearchStation={onSaveSearchStation}
            />}

            {isEdit && <StationEdit
                setIsEdit={setIsEdit}
                setCurrStation={setStation}
                setMainImg={setImgUrl}
                currStation={station} />}
        </div>

    </div >
}