import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { defaultImg, loadingImg, checkImg, getTotalSongDur } from "../services/station.service"
import { uploadImg } from "../services/upload.service"
import { updateStation } from "../store/station.actions"
import { LikesBtns } from "./likes-btn"
import { StationDropdown } from "./station-dropdown"
import { StationEdit } from "./station-edit"

export const StationHeader = ({ bgColor, isUserStation, station, onRemoveStation, setStation, LikedSongLogo }) => {
    const user = useSelector(state=> state.userModule.user)
    const [imgUrl, setImgUrl] = useState(station.imgUrl || defaultImg)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const dispatch = useDispatch()
    console.log(isUserStation)

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

    const isAdmin = station.createdBy === 'Admin' ? true : false

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
                {isUserStation &&
                    <div><p className="creator-and-playlist-data">
                        {/* <Link
                            to='/user-profile'
                            className='my-sd-user-name'>{(station?.createdBy?.fullname).charAt(0).toUpperCase() + (station?.createdBy?.fullname).substring(1)} ● </Link>
                        Total of {user.likedSongs?.length} {user?.likedSongs.length === 1 ? 'song' : 'songs'}, Total duration: {getTotalSongDur(user?.likedSongs)} */}
                    </p>
                    </div>
                }
            </div>
        </div>

        <div
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}
            className='pl-container'>
            {station._id !== 'liked-station' &&
                <div className="sd-btns-container">
                    {/* <LikesBtns /> */}
                    <i
                        onClick={() => setIsDropdown(!isDropdown)}
                        className='fa-solid fa-ellipsis'></i>
                </div>
            }

            {isDropdown && <StationDropdown
                isDropdown={isDropdown}
                setIsDropdown={setIsDropdown}
                isAdmin={isAdmin}
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