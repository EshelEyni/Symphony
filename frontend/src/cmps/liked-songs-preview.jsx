import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { stationService } from '../services/station.service'
import { setMediaPlayerClip, setPlaylist } from '../store/media-player.actions'

export const LikedSongsPreview = () => {
    const { isPlaying, currPlaylist, togglePlayFunc } = useSelector(state => state.mediaPlayerModule)
    const { loggedinUser } = useSelector(state => state.userModule)
    const [isClicked, setIsClicked] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        const isCurrStationPlaying = currPlaylist.name === 'Liked Songs'
        if (!currPlaylist) return
        if (isCurrStationPlaying)
            setIsClicked(isPlaying)

        if (!isCurrStationPlaying)
            setIsClicked(false)

    }, [currPlaylist, isPlaying])

    const getSongs = () => {
        let songsStr = loggedinUser.likedSongs.clips.map(song => song?.title).join(' ● ')
        songsStr = songsStr.length > 150 ? songsStr.slice(0, 150) + '...' : songsStr
        return songsStr
    }

    const onTogglePlay = (ev) => {
        ev.stopPropagation()
        ev.preventDefault()

        if (!isClicked) {
            dispatch(setPlaylist(loggedinUser.likedSongs))
            dispatch(setMediaPlayerClip(loggedinUser.likedSongs.clips[0]))
        }
        togglePlayFunc()
    }

    return (
        <Link
            className='liked-songs-preview'
            to={'/liked'}>
            <main className='liked-songs-preview-container flex column space-around'>
                <p>{getSongs()}</p>
                <div className='flex space-between'>
                    <div>
                        <p className='title-preview'> Liked Songs</p>
                        <p>
                            Liked songs: {loggedinUser.likedSongs.clips.length} | Total Duration: {stationService.getTotalSongDur(loggedinUser.likedSongs.clips)}
                        </p>
                    </div>
                    {loggedinUser.likedSongs.clips.length > 0 &&
                        <div className='play-btn-container'>
                            <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                                onClick={(ev) => {
                                    onTogglePlay(ev)
                                }}></button>
                        </div>}
                </div>
            </main>
        </Link>
    )
}