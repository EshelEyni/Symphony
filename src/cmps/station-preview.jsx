import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { storageService } from '../services/async-storage.service'
import { clearMsg, msg } from '../services/user.service'
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from '../store/media-player.actions'
import { removeStation } from '../store/station.actions'
import { setUserMsg, updateUser } from '../store/user.actions'

export const StationPreview = ({
    currStation,
    isSearch }) => {
    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)
    const loggedInUser = useSelector(state => state.userModule.user)

    let [isClicked, setIsClicked] = useState()
    const dispatch = useDispatch()
    const stationId = currStation?._id

    useEffect(() => {
        if (!currClip || !currPlaylist) return
        if (stationId === currPlaylist._id) {
            console.log('USE_EFFECT3');
            setIsClicked(isPlaying)
        }
    }, [isPlaying])

    useEffect(() => {
        if (!currPlaylist) return
        if (stationId !== currPlaylist._id)
            setIsClicked(false)
    }, [currPlaylist])


    const onTogglePlay = async (e) => {
        // Stops button from navigating to link
        e.stopPropagation()
        e.preventDefault()
        const clip = currStation.clips[0]


        if (!isClicked) {
            dispatch(setIsPlaying(false))
            clearInterval(mediaPlayerInterval)
            dispatch(setPlaylist(currStation))
            dispatch(setClip(clip))
            console.log('clip StationPreview', clip)
            dispatch(setMediaPlayerInterval(setInterval(getTime, 750)))
            playerFunc.playVideo()
        }
        if (isClicked) {
            clearInterval(mediaPlayerInterval)
            playerFunc.pauseVideo()
        }
        dispatch(setIsPlaying(!isPlaying))
    }

    const getTime = async () => {
        const time = await playerFunc.getCurrentTime()
        storageService.put('currTime', time)
        dispatch(setCurrTime(time))
        if (currTime > clipLength - 1.5) {
            const currIdx = currPlaylist.clips.indexOf(currClip)
            let nextIdx = currIdx + 1
            if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
            currClip = currPlaylist.clips[nextIdx]
        }
        dispatch(setClip(currClip))
        dispatch(setIsPlaying(true))
    }


    const onRemoveStation = (e) => {
        e.stopPropagation()
        e.preventDefault()
        dispatch(removeStation(currStation._id))
        dispatch(setUserMsg(msg(currStation.name, ' removed from your library')))
        setTimeout(() => {
            dispatch(setUserMsg(clearMsg))
        }, 2500)
        const userToUpdate = { ...loggedInUser }
        userToUpdate.createdStations = userToUpdate.createdStations.filter(playlistId => playlistId !== currStation._id)
        userToUpdate.recentSearches = userToUpdate.recentSearches.filter(recentSearch => recentSearch._id !== currStation._id)
        dispatch(updateUser(userToUpdate))
    }


    return <article className='station-preview' >
        <Link to={'/station/' + currStation._id}>
            <div className='station'>
                {isSearch && <div className='recent-search-delete-btn-container'>
                    <i className="fa-solid fa-xmark"
                        onClick={onRemoveStation}></i> </div>}
                <div className='img-container'>
                    <img src={currStation.imgUrl} alt={currStation['logo-desc']} />

                    <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={(e) => {
                            onTogglePlay(e)
                            setIsClicked(!isClicked)
                        }}></button>
                </div>
                <div className='desc-container '>
                    <div>
                        <h4>{currStation.name}</h4>
                    </div>
                    <div>
                        <p className='fs12'>{currStation.desc}</p>
                    </div>


                </div>
            </div>
        </Link>
    </article>
}