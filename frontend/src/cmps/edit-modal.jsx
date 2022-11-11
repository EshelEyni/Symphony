import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { updateStation } from '../store/station.actions'
import { uploadImg } from '../services/upload.service'
import { updateUser } from '../store/user.actions'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'
import { defaultImg } from '../services/user.service'
import { setBackgroundColor } from '../services/bg-color.service'

export const EditModal = ({
    user,
    currStation,
    setMainImg,
    setIsEdit
}) => {

    const [objectToEdit, setObjectToEdit] = useState(user ? { ...user } : { ...currStation })
    const [imgUrl, setImgUrl] = useState(user ? user.imgUrl : currStation?.imgUrl)
    const [isChangedImg, setIsChangedImg] = useState(false)

    const dispatch = useDispatch()

    const onUploadImgEdit = async (ev) => {
        const objectToUpdate = { ...objectToEdit }
        setIsChangedImg(true)
        setImgUrl(defaultImg)
        objectToUpdate.imgUrl = await uploadImg(ev)
        setObjectToEdit(objectToUpdate)
        setImgUrl(objectToUpdate.imgUrl)
        setIsChangedImg(false)
    }

    const handleChange = ({ target }) => {
        let objectToUpdate = { ...objectToEdit }
        objectToUpdate[target.name] = target.value
        setObjectToEdit(objectToUpdate)
    }

    const onUpdateObject = async (ev) => {
        ev.preventDefault()
        const objectToUpdate = { ...objectToEdit }
        await setBackgroundColor(objectToUpdate)
        if (currStation) dispatch(updateStation(objectToUpdate))
        else dispatch(updateUser(objectToUpdate))
        setMainImg(imgUrl)
        setIsEdit(false)
    }

    return (
        <section className='edit-modal' >
            <div className='main-screen'
                onClick={() => setIsEdit(false)} />

            <main className='edit-modal-container flex column'>
                <header className='edit-modal-header flex'>
                    <h2>{user ? 'Edit Profile' : 'Edit Playlist'}</h2>
                    < button
                        className='btn-close'
                        onClick={() => setIsEdit(false)}
                    ><DisabledByDefaultRoundedIcon />
                    </button>
                </header>

                <div className='edit-modal-form-container flex'>
                    <label htmlFor='edit-img'>
                        {!isChangedImg && <img
                            className='edit-form-img '
                            src={imgUrl}
                            alt='playist-img' />}
                        {isChangedImg && <img
                            className={'edit-form-img ' + (imgUrl === defaultImg ? 'rotate' : '')}
                            src={imgUrl}
                            alt='playist-img' />}
                    </label>
                    <input
                        className='img-input'
                        id='edit-img'
                        onChange={onUploadImgEdit} type='file' />

                    <form
                        onSubmit={onUpdateObject}>
                        <input
                            className='edit-form-input-name'
                            defaultValue={currStation?.name || user?.username}
                            onChange={handleChange}
                            type='text'
                            name={user ? 'username' : 'name'}
                            id='name'
                        />
                        {currStation &&
                            <textarea
                                className='edit-form-input-desc'
                                defaultValue={currStation.desc}
                                placeholder='Add an optional description'
                                onChange={handleChange}
                                type='text-area'
                                name='desc'
                                id='name'
                            />}
                        <button
                            className='btn-edit-save'
                        >Save</button>
                    </form>
                </div>
            </main>
        </section >
    )
}