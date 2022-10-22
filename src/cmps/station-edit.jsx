import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { updateStation } from '../store/station.actions'
import { uploadImg } from '../services/upload.service'
import { defaultImg, loadingImg } from '../services/station.service'
import { updateUser } from '../store/user.actions'
import { useSelector } from 'react-redux'


export const StationEdit = ({
    currStation,
    setCurrStation,
    setMainImg,
    setIsEdit
}) => {

    const loggedInUser = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()
    const [imgUrl, setImgUrl] = useState()
    let [editFormStation, setEditFormStation] = useState()
    const [isChangedImg, setIsChangedImg] = useState(false)
    const inputRef = useRef()

    useEffect(() => {
        setEditFormStation({ ...currStation })
        setImgUrl(currStation.imgUrl)
    }, [])

    const onUploadImgEdit = async (ev) => {
        const stationToUpdate = { ...editFormStation }
        setIsChangedImg(true)
        setImgUrl(defaultImg)
        const uploadedImgUrl = await uploadImg(ev)
        stationToUpdate.imgUrl = uploadedImgUrl
        delete stationToUpdate.bgColor
        setEditFormStation(stationToUpdate)
        setImgUrl(uploadedImgUrl)
        setIsChangedImg(false)
    }

    const handleChange = ({ target }) => {
        const field = target.name
        const value = target.value
        let stationToUpdate = { ...editFormStation }
        stationToUpdate[field] = value
        setEditFormStation(stationToUpdate)
    }

    const onUpdateStation = (ev) => {
        ev.preventDefault()
        setCurrStation(editFormStation)
        setMainImg(imgUrl)
        dispatch(updateStation(editFormStation))
        dispatch(updateUser(loggedInUser))
        setIsEdit(false)
    }

    return (
        <div className='ms-edit-container'>
            <div
                onClick={() => setIsEdit(false)}
            ></div>
            <div className='station-edit-main-container flex'>
                <button className='btn-close'></button>
                <div className='pl-img-container'>
                    <label htmlFor='pl-edit-img'>
                        {!isChangedImg && <img
                            className='station-img '
                            src={imgUrl}
                            alt='playist-img' />}
                        {isChangedImg && <img
                            className={'station-img ' + (imgUrl === defaultImg ? 'rotate' : '')}
                            src={imgUrl}
                            alt='playist-img' />}
                    </label>
                    <input
                        className='img-input'
                        id='pl-edit-img'
                        onChange={onUploadImgEdit} type='file' />
                </div>
                <form
                    className='station-edit-form flex column'
                    onSubmit={onUpdateStation}>
                    <input
                        className='station-edit-input-name'
                        ref={inputRef}
                        defaultValue={currStation.name}
                        onChange={handleChange}
                        type='text'
                        name='name'
                        id='name'
                    />
                    <textarea
                        className='station-edit-input'
                        ref={inputRef}
                        defaultValue={currStation.desc}
                        placeholder='Add an optional description'
                        onChange={handleChange}
                        type='text-area'
                        name='desc'
                        id='name'
                    />
                    <button
                        className='btn-edit-save'
                    >Save</button>
                </form>
            </div>
        </div>
    )
}



