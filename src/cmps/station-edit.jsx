import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { loadStations, updateStation } from '../store/station.actions'
import { uploadImg } from '../services/upload.service'
import { loadingImg } from '../services/station.service'
import { updateUser } from '../store/user.actions'
import { useSelector } from 'react-redux'


export const StationEdit = ({ currStation, setCurrStation, setMainImg, setIsEdit }) => {
    const loggedInUser = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()
    const [imgUrl, setImgUrl] = useState()
    let [updatedStation, setUpdatedStation] = useState({ ...currStation })
    const inputRef = useRef()

    useEffect(() => {
        setImgUrl(currStation.imgUrl)
    }, [])


    const onUploadImgEdit = async (ev) => {
        setImgUrl(loadingImg)
        const currImgUrl = await uploadImg(ev)
        updatedStation.imgUrl = currImgUrl
        setUpdatedStation(updatedStation)
        setImgUrl(currImgUrl)
    }

    const handleChange = ({ target }) => {
        const field = target.name
        const value = target.value
        updatedStation[field] = value
        setUpdatedStation(updatedStation)
    }

    const onUpdateStation = (ev) => {
        ev.preventDefault()
        setCurrStation(updatedStation)
        dispatch(updateStation(updatedStation))
        dispatch(updateUser(loggedInUser))
        setMainImg(imgUrl)
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
                        <img
                            className='station-img'
                            src={imgUrl}
                            alt='playist-img' />
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
                    <input
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



