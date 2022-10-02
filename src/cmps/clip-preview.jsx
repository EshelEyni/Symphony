import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { getDuration, shortTitle } from '../services/clip.service'
import { LikesBtns } from './likes-btn'
import { ClipDropdown } from './clip-dropdown'
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from '../store/media-player.actions'
import { useDispatch } from 'react-redux'
import { storageService } from '../services/async-storage.service'
import { updateUser } from '../store/user.actions'
import { userService } from '../services/user.service'
import { equalizer, getDate } from '../services/clip.service'
export const ClipPreview = ({
    station,
    clip,
    type,
    idx,
    clipNum,
    onRemoveClip,
    bgColor,
    dndStyle }) => {

    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)

    const loggedInUser = useSelector(state => state.userModule.user)
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

    const onTogglePlay = (clip, isClicked, loggedInUser) => {
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
        const userToUpdate = { ...loggedInUser }
        userService.updateUserRecentlyPlayedClips(userToUpdate, clip)
        dispatch(updateUser(userToUpdate))
    }

    const getTime = async () => {
        console.log('LOCAL GET TIME');
        console.log('mediaPlayerInterval', mediaPlayerInterval)
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
    // const linearBgc = `linear-dradient(180deg, rgba(2,0,36,1) 0%, rgba(18,19,19,0.6348914565826331) 35%, rgba(0,212,255,1) 100%))`

    return <li
        style={{
            backgroundColor: dndStyle?.backgroundColor,
            color: dndStyle?.color,
            borderRadius: dndStyle?.borderRadius,
            cursor: dndStyle?.cursor,
        }}

        className={'clip-preview-container '} >
        <div className='clip-preview-main-container'>
            {currClip?._id === clip?._id && isPlaying ? <div className='clip-equalizer'><img src={equalizer} alt='clip-img' /></div> :
                <React.Fragment>
                    <i className={'clip-play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={() => {
                            setIsClicked(!isClicked)
                            onTogglePlay(clip, isClicked, loggedInUser)
                        }}></i>
                    <div className='clip-num'>{clipNum ? clipNum : idx + 1}</div>
                </React.Fragment>
            }
            <div className='clip-title flex align-center'>
                <img className='clip-img' src={clip.img?.url} alt='clip-img' />
                <div className='title-text flex column'>
                    <h1>{shortTitle(clip)}</h1>
                    <p>{clip.artist}</p>
                </div>
            </div>
            <div className='artist-name'>{clip.artist}</div>
            {!isCreatedAt && <div className='added'>{clip.createdAt || clip.LikedAt || new Date(clip.addedAt * 1000).toLocaleDateString('he-IL')}</div>}
            {loggedInUser && <LikesBtns clip={clip} station={station} />}
            {clip.duration ? <div className='clock-area'>{getDuration(clip.duration)}</div> : ''}
            <i
                className='dropdown-btn fa-solid fa-ellipsis'
                onClick={() => setIsDropdownClip(!isDropdownClip)}>

                {isDropdownClip && <ClipDropdown
                    station={station}
                    setIsDropdownClip={setIsDropdownClip}
                    onRemoveClip={onRemoveClip}
                    clip={clip}
                />}
            </i>
        </div>
    </li >

}