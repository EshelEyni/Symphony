import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { updateStation } from '../store/station.actions'
import { uploadImg } from '../services/upload.service'
import { loadingImg } from '../services/station.service'


export const StationEdit = ({ currStation, setCurrStation, setMainImg, setIsEdit }) => {
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
        dispatch(updateStation(updatedStation))
        setCurrStation(updatedStation)
        setMainImg(imgUrl)
        setIsEdit(false)
    }


    return (
        <div className='ms-edit-container'>
            <div
                onClick={() => setIsEdit(false)}
            ><i className='fa-regular fa-rectangle-xmark'></i></div>
            <div className='ms-edit-main-container flex'>
                <div className='pl-img-container'>
                    <label htmlFor='pl-edit-img'>
                        <img
                            className='my-sd-img'
                            src={imgUrl}
                            alt='playist-img' />
                    </label>
                    <input
                        className='pl-img-input'
                        id='pl-edit-img'
                        onChange={onUploadImgEdit} type='file' />
                </div>
                <form
                    className='ms-edit-form flex column'
                    onSubmit={onUpdateStation}>
                    <input
                        className='ms-edit-input'
                        ref={inputRef}
                        defaultValue={currStation.name}
                        onChange={handleChange}
                        type='text'
                        name='name'
                        id='name'
                    />
                    <input
                        className='ms-edit-input'
                        ref={inputRef}
                        defaultValue={currStation.desc}
                        placeholder='Add an optional description'
                        onChange={handleChange}
                        type='text-area'
                        name='desc'
                        id='name'
                    />
                    <button
                        className='btn-save-toy'
                    >Save</button>
                </form>
            </div>
        </div>
    )
}



