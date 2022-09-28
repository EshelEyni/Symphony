import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
// import { Link } from "react-router-dom"
import { defaultImg, checkImg } from "../services/station.service"
import { uploadImg } from "../services/upload.service"
import { updateStation } from "../store/station.actions"
// import { LikesBtns } from "./likes-btn"
import { StationDropdown } from "./station-dropdown"
import { StationEdit } from "./station-edit"
import { HeaderDetails } from "./header-details"

export const StationHeader = ({ bgColor, isUserStation, station, onRemoveStation, setStation, LikedSongLogo, isAdminMode, setAdminMode }) => {
    const user = useSelector(state => state.userModule.user)
    const [imgUrl, setImgUrl] = useState(station.imgUrl || defaultImg)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setImgUrl(station.imgUrl)
    }, [station])

    const onUploadImg = async (ev) => {
        setImgUrl(defaultImg)
        const currImgUrl = await uploadImg(ev)
        station.imgUrl = currImgUrl
        setImgUrl(currImgUrl)
        dispatch(updateStation(station))
    }

    return <div className='my-sd-header'>
        <div
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}
            className='my-sd-header-main-container flex'>
            {<div className='pl-img-container'>
                <label htmlFor='pl-img'>
                    <img
                        className={'my-sd-img ' + (checkImg(imgUrl) ? 'rotate' : '')}
                        src={LikedSongLogo ? LikedSongLogo : imgUrl}
                        alt='playist-img' />
                </label>
                {(isUserStation && !LikedSongLogo) &&
                    <input
                        className='pl-img-input'
                        id='pl-img'
                        onChange={onUploadImg} type='file' />
                }</div>}

            <div className='my-sd-details'>
                <h1 className='my-sd-h1'>{station.name}</h1>
                <div className='desc-container'>{station.desc}</div>
                {isUserStation ? <HeaderDetails
                    creator={station.createdBy.fullname} clips={user.likedSongs} /> :
                    <HeaderDetails
                        creator={station.createdBy.username} clips={station.clips} />}
            </div>
        </div>
        <div className='playlist-btns'
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}>
            <button className='play-btn fas fa-play playing'></button>
            <button className='clip-dp-btn fa-solid fa-ellipsis' onClick={() => setIsDropdown(!isDropdown)}></button>
            {user?.isAdmin &&
                <span
                    className="admin-state-btn"
                    onClick={() => setAdminMode(!isAdminMode)}
                >⭐</span>
            }
        </div>
        <div
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}
            className='pl-container'>
            {station._id !== 'liked-station' &&
                <div className="sd-btns-container">
                    {/* <LikesBtns /> */}
                </div>
            }

            {isDropdown && <StationDropdown
                isAdminMode={isAdminMode}
                isDropdown={isDropdown}
                setIsDropdown={setIsDropdown}
                isUserStation={isUserStation}
                setIsEdit={setIsEdit}
                onRemoveStation={onRemoveStation}
            />}

            {isEdit && <StationEdit
                setIsEdit={setIsEdit}
                setCurrStation={setStation}
                setMainImg={setImgUrl}
                currStation={station} />}
        </div>

    </div >
}