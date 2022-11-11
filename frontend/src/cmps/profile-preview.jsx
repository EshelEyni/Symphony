import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setMediaPlayerClip, setPlaylist } from '../store/media-player.actions'

export const ProfilePreview = ({
    user
}) => {

    const { isPlaying, currPlaylist, togglePlayFunc } = useSelector(state => state.mediaPlayerModule)
    const [isClicked, setIsClicked] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        const isCurrStationPlaying = user._id === currPlaylist?._id
        if (!currPlaylist) return
        if (isCurrStationPlaying)
            setIsClicked(isPlaying)

        if (!isCurrStationPlaying)
            setIsClicked(false)

    }, [currPlaylist, user, isPlaying])


    const onTogglePlay = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()

        if (!isClicked) {
            dispatch(setPlaylist(user))
            dispatch(setMediaPlayerClip(user.clips[0]))
        }
        togglePlayFunc()
    }

    return (
        <article className='profile-preview' >
            <Link to={(user.isArtist ? '/artist/' : '/profile/') + user?._id}>
                <main className='profile-preview-container'>

                    <section className='profile-img-container'>
                        <img
                            className='profile-img'
                            src={user?.imgUrl}
                            alt='user-profile-img' />

                        {(user.isArtist && user.clips.length > 0) &&
                            <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                                onClick={(ev) => {
                                    onTogglePlay(ev)
                                }} />}
                    </section>

                    <div className='desc-container'>
                        <h4>{user?.username}</h4>
                        <p>{user.isArtist ? 'Artist' : 'Profile'}</p>
                    </div>
                </main>
            </Link>
        </article>
    )
}