import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { updateStation } from '../store/station.actions'
import { uploadImg } from '../services/upload.service'
import { loadingImg, checkLoading, defaultImg } from '../services/profile-service'
import { updateUser } from '../store/user.actions'


export const ProfileEdit = ({ user, setUser, setMainImg, setIsEdit }) => {
    const dispatch = useDispatch()
    const [imgUrl, setImgUrl] = useState()
    let [updatedUser, setUpdatedUser] = useState({ ...user })
    const inputRef = useRef()

    useEffect(() => {
        setImgUrl(user.imgUrl)
    }, [])


    const onUploadImgEdit = async (ev) => {
        setImgUrl(defaultImg)
        const currImgUrl = await uploadImg(ev)
        updatedUser.imgUrl = currImgUrl
        setUpdatedUser(updatedUser)
        setImgUrl(currImgUrl)
    }

    const handleChange = ({ target }) => {
        const field = target.name
        const value = target.value
        updatedUser[field] = value
        setUpdatedUser(updatedUser)
    }

    const onUpdateUser = (ev) => {
        ev.preventDefault()
        dispatch(updateUser(updatedUser))
        setUser(updatedUser)
        setMainImg(imgUrl)
        setIsEdit(false)
    }


    return (
        <div className='ms-edit-container'>
            <div onClick={() => setIsEdit(false)}>
            </div>

            <div className='station-edit-main-container flex'>
                <button className='btn-close'>X</button>
                <div className='pl-img-container'>
                    <label htmlFor='pl-edit-img'>
                        <img
                            className={'station-img' + checkLoading(imgUrl)}
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
                    onSubmit={onUpdateUser}>
                    <input
                        className='station-edit-input'
                        ref={inputRef}
                        defaultValue={user.fullname}
                        onChange={handleChange}
                        type='text'
                        name='fullname'
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



