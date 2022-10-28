import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Equalizer } from './equalizer'
import { setMediaPlayerClip, setPlaylist } from '../store/media-player.actions'
import { removeStation } from '../store/station.actions'
import { setUserMsg, updateUser } from '../store/user.actions'

export const StationPreview = ({
    currStation,
    isSearch
}) => {

    const { isPlaying, currPlaylist, togglePlayFunc } = useSelector(state => state.mediaPlayerModule)
    const { loggedinUser } = useSelector(state => state.userModule)
    const [isClicked, setIsClicked] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        const isCurrStationPlaying = currStation._id === currPlaylist?._id
        if (!currPlaylist) return
        if (isCurrStationPlaying)
            setIsClicked(isPlaying)

        if (!isCurrStationPlaying)
            setIsClicked(false)

    }, [currPlaylist, currStation, isPlaying])


    const onTogglePlay = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()

        if (!isClicked) {
            dispatch(setPlaylist(currStation))
            dispatch(setMediaPlayerClip(currStation.clips[0]))
        }
        togglePlayFunc()
    }

    const onRemoveStation = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        dispatch(removeStation(currStation._id))
        dispatch(setUserMsg(currStation.name + ' removed from your library'))
        setTimeout(() => dispatch(setUserMsg(null)), 2500)
        const userToUpdate = { ...loggedinUser }
        userToUpdate.createdStations = userToUpdate.createdStations.filter(id => id !== currStation._id)
        userToUpdate.publicStations = userToUpdate.publicStations.filter(id => id !== currStation._id)
        userToUpdate.recentSearches = userToUpdate.recentSearches.filter(recentSearch => recentSearch._id !== currStation._id)
        dispatch(updateUser(userToUpdate))
    }


    return <article className='station-preview' >
        <Link
            title={currStation.name}
            to={'/station/' + currStation._id}>
            <main className='station-preview-main-container'>
                {isSearch && <div className='recent-search-delete-btn-container'>
                    <i className='fa-solid fa-xmark'
                        onClick={onRemoveStation}></i> </div>}
                <section className='img-container'>
                    <img
                        className='station-preview-img'
                        src={currStation.imgUrl}
                        alt='Playlist-img' />
                    {currStation.clips.length > 0 &&
                        <section className='play-btn-container'>
                            <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                                onClick={(ev) => {
                                    onTogglePlay(ev)
                                }}></button>
                            {(currStation._id === currPlaylist?._id && isPlaying) && <Equalizer />}
                        </section>}
                </section>
                <section className='desc-container '>
                    <div>
                        <h4>{currStation.name}</h4>
                    </div>
                    <div>
                        <p className='fs12'>{currStation.desc}</p>
                    </div>
                </section>
            </main>
        </Link>
    </article>
}