import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { storageService } from '../services/async-storage.service'
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from '../store/media-player.actions'

export const StationPreview = ({ station }) => {
    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)
    let [isClicked, setIsClicked] = useState()
    const dispatch = useDispatch()
    const stationId = station?._id

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
        const clip = station.clips[0]


        if (!isClicked) {
            dispatch(setIsPlaying(false))
            clearInterval(mediaPlayerInterval)
            dispatch(setPlaylist(station))
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


    return <article className='station-preview' >
        <Link to={'/station/' + station._id}>
            <div className='station'>
                <div className='img-container'>
                    <img src={station.imgUrl} alt={station['logo-desc']} />

                    <button className={'play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={(e) => {
                            onTogglePlay(e)
                            setIsClicked(!isClicked)
                        }}></button>
                </div>
                <div className='desc-container flex column space-between'>
                    <div>
                        <h4>{station.name}</h4>
                    </div>
                    <div>
                        <p className='fs12'>{station.desc}</p>
                    </div>


                </div>
            </div>
        </Link>
    </article>
}