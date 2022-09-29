import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { getDuration } from '../services/clip.service'
import { LikesBtns } from './likes-btn'
import { ClipDropdown } from './clip-dropdown'
import { defaultBgcolor } from '../services/bg-color.service'
import { useParams } from 'react-router-dom'
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from '../store/media-player.actions'
import { useDispatch } from 'react-redux'
import { storageService } from '../services/async-storage.service'
const equalizer = 'https://res.cloudinary.com/dk9b84f0u/image/upload/v1664386983/Symphny/ezgif.com-gif-maker_cbbaoz.gif'

export const ClipPreview = ({ clip, type, idx, clipNum, station, onRemoveClip, bgColor, dndStyle }) => {
    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)

    const user = useSelector(state => state.userModule.user)
    const params = window.location.href
    let [isDropdownClip, setIsDropdownClip] = useState(false)
    let [isClicked, setIsClicked] = useState()


    useEffect(() => {
        if (!currClip || !currPlaylist) return
        if (clip._id === currClip._id) {
            setIsClicked(isPlaying)
        }
    }, [isPlaying])

    const isCreatedAt = (type === 'search-res' || type === 'queue-clip')
    const dispatch = useDispatch()

    const onTogglePlay = async (clip, isClicked) => {
        console.log('clip', clip)
        if (!isClicked) {
            dispatch(setIsPlaying(false))
            clearInterval(mediaPlayerInterval)
            dispatch(setPlaylist(station))
            dispatch(setClip(clip))
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

    // const getBgcolor = () => {
    //     let currBgcolor = defaultBgcolor
    //     if (bgColor) currBgcolor = bgColor
    //     if (dndStyle?.backgroundColor) currBgcolor = dndStyle.backgroundColor
    //     return currBgcolor
    // }

    return <li
        style={{
            backgroundColor: dndStyle?.backgroundColor ? dndStyle.backgroundColor : defaultBgcolor,
            background: `linear-dradient(180deg, rgba(2,0,36,1) 0%, rgba(18,19,19,0.6348914565826331) 35%, rgba(0,212,255,1) 100%))`,
            color: dndStyle?.color,
            borderRadius: dndStyle?.borderRadius,
            cursor: dndStyle?.cursor,
        }}

        className={'clip-preview-container '} >
        <div className='clip-preview-main-container'>
            <div className='clip-preview-container-1'>

                {currClip?._id === clip?._id && isPlaying ? <div className='clip-equalizer'><img src={equalizer} alt='clip-img' /></div> :
                    <React.Fragment>
                        <i className={'clip-play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                            onClick={() => {
                                setIsClicked(!isClicked)
                                onTogglePlay(clip, isClicked)
                            }}></i>
                        <div className='clip-num'>{clipNum ? clipNum : idx + 1}</div>
                    </React.Fragment>
                }


                <img className='clip-img' src={clip.img?.url} alt='clip-img' />
                <div className='clip-title'>
                    {clip.title}
                </div>
            </div>
            <div className='artist-name'>{clip.artist}</div>
            {!isCreatedAt && <div className='added'>{clip.createdAt || clip.LikedAt}</div>}
            <div className='clip-preview-container-2 flex'>
                {user && <LikesBtns clip={clip} station={station} />}
                {clip.duration ? getDuration(clip.duration) : ''}
            </div>

            <i
                className='dropdown-btn fa-solid fa-ellipsis'
                onClick={() => setIsDropdownClip(!isDropdownClip)}>

                {(isDropdownClip) && <ClipDropdown
                    station={station}
                    setIsDropdownClip={setIsDropdownClip}
                    onRemoveClip={onRemoveClip}
                    clip={clip}
                />}
            </i>
        </div>
    </li >

}