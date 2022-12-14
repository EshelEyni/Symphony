import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
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
            <main className='station-preview-container'>
                {isSearch && <div className='recent-search-delete-btn-container'>
                    <i className='fa-solid fa-xmark'
                        onClick={onRemoveStation}></i> </div>}
                <div className='station-preview-img-container'>
                    <img
                        className='station-preview-img'
                        src={currStation.imgUrl}
                        alt='Playlist-img' />
                    {currStation.clips.length > 0 &&
                        <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                            onClick={(ev) => {
                                onTogglePlay(ev)
                            }} />}
                </div>
                <div className='desc-container'>
                    <h4 title={currStation.name}>{currStation.name}</h4>
                    <p title={currStation.desc}>{currStation.desc}</p>
                </div>
            </main>
        </Link>
    </article>
}