import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clipService } from '../services/clip.service'
import { LikeIcon } from './like-icon'
import { Dropdown } from './dropdown'
import { Equalizer } from './equalizer'
import { setMediaPlayerClip, setIsPlaying, setPlaylist } from '../store/media-player.actions'

export const ClipPreview = ({
    currStation,
    currClip,
    idx,
    clipNum,
    onRemoveClip,
    onAddClip,
    bgColor,
    dndStyle,
    isLike,
    isRecentlyPlayed
}) => {

    const { isPlaying, currMediaPlayerClip, currPlaylist, togglePlayFunc } = useSelector(state => state.mediaPlayerModule)
    const { user } = useSelector(state => state.userModule)
    const { artists } = useSelector(state => state.artistModule)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const dispatch = useDispatch()
    const isCurrClipPlaying = currStation?._id === currPlaylist?._id && currClip?._id === currMediaPlayerClip?._id && isPlaying

    useEffect(() => {
        if (!currMediaPlayerClip || !currPlaylist) return
        if (currClip?._id === currMediaPlayerClip._id) {
            setIsClicked(isPlaying)
        }
    }, [isPlaying, currClip, currMediaPlayerClip, currPlaylist])

    useEffect(() => {
        if (!currPlaylist) return
        if (isCurrClipPlaying) dispatch(setIsPlaying(true))
        else setIsClicked(false)
    }, [isPlaying, currClip, currMediaPlayerClip, currPlaylist])

    const onTogglePlay = () => {
        if (!isClicked) {
            if (currStation._id !== currPlaylist._id) dispatch(setPlaylist(currStation))
            if (currMediaPlayerClip._id !== currClip._id) dispatch(setMediaPlayerClip(currClip))
            setIsClicked(true)
        }
        togglePlayFunc()
    }

    const getBgcolor = () => {
        let currBgcolor = bgColor
        if (dndStyle?.backgroundColor) currBgcolor = dndStyle.backgroundColor
        return currBgcolor
    }

    const getDateAdded = () => {
        let currTimeStamp = currClip.createdAt
        if (isRecentlyPlayed) currTimeStamp = currClip.playedAt
        if (isLike) currTimeStamp = currClip.likedAt
        const formattedTimeStamp = +((Date.now() - currTimeStamp) / 1000).toFixed()
        return clipService.getTimeStr(currTimeStamp, formattedTimeStamp)
    }

    return <li
        style={{
            backgroundColor: dndStyle?.backgroundColor,
            // backgroundColor: getBgcolor(),
            color: dndStyle?.color,
            borderRadius: dndStyle?.borderRadius,
            cursor: dndStyle?.cursor,
        }}
        className={'clip-preview-container '} >
        {currClip &&
            <section className='clip-preview-main-container'>
                <div>
                    <i className={'clip-play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={onTogglePlay}></i>
                    {isCurrClipPlaying ? <Equalizer /> :
                        <span className='clip-num'>{clipNum ? clipNum : idx + 1}</span>}
                </div>

                <section className='clip-title flex align-center'>
                    <section className='clip-img-container'>
                        <img className='clip-img' src={currClip.img?.url} alt='clip-img' />
                    </section>
                    <section className='title-text flex column'>
                        <h1 style={{ color: dndStyle?.color }}>{clipService.getFormattedTitle(currClip)}</h1>
                        <p style={{ color: dndStyle?.color }}>{currClip.artist}</p>
                    </section>
                </section>
                <span className='artist-name'>{currClip.artist}</span>
                <span className='added' > {getDateAdded()} </span>

                {user && <LikeIcon
                    currStation={currStation}
                    currClip={currClip}
                    inputId={currClip._id}
                    isClipPreview={true}
                />}

                {currClip.duration ? <div className='clock-area'>{clipService.getDuration(currClip.duration)}</div> : ''}

                <i className='dropdown-btn fa-solid fa-ellipsis'
                    onClick={() => setIsDropdown(!isDropdown)}>

                    {isDropdown && <Dropdown
                        setIsDropdown={setIsDropdown}
                        isClipDropdown={true}
                        currClip={currClip}
                        isUserClip={currStation?.createdBy?._id === user?._id}
                        artists={artists}
                        currStation={currStation}
                        onRemoveClip={onRemoveClip}
                        onAddClip={onAddClip}
                    />}
                </i>
            </section>}
    </li >
}