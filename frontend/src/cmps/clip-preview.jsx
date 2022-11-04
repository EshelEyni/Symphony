import React, { useEffect, useRef, useState } from 'react'
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
    dndStyle,
    isLike,
    isArtistDetails,
    isRecentlyPlayed
}) => {

    const { isPlaying, currMediaPlayerClip, currPlaylist, togglePlayFunc } = useSelector(state => state.mediaPlayerModule)
    const { loggedinUser } = useSelector(state => state.userModule)
    const [isDropdown, setIsDropdown] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const dropdownBtnRef = useRef()
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

    const getDateAdded = () => {
        let currTimeStamp = currClip.createdAt
        if (isRecentlyPlayed) currTimeStamp = currClip.playedAt
        if (isLike) currTimeStamp = currClip.likedAt
        const formattedTimeStamp = +((Date.now() - currTimeStamp) / 1000).toFixed()
        return clipService.getTimeStr(currTimeStamp, formattedTimeStamp)
    }

    if (currClip)
        return <li
            style={{
                backgroundColor: dndStyle?.backgroundColor,
                color: dndStyle?.color,
                borderRadius: dndStyle?.borderRadius,
                cursor: dndStyle?.cursor,
            }}
            className='clip-preview'>

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

                {loggedinUser && <LikeIcon
                    currStation={currStation}
                    currClip={currClip}
                    inputId={currClip._id}
                    isClipPreview={true}
                />}

                {currClip.duration ? <div className='clip-header-clock'>{clipService.getDuration(currClip.duration)}</div> : ''}

                <i className='dropdown-btn fa-solid fa-ellipsis'
                    ref={dropdownBtnRef}
                    onClick={() => setIsDropdown(!isDropdown)} />

                {isDropdown && <Dropdown
                    leftPos={dropdownBtnRef.current.offsetLeft - 120}
                    isDropdown={isDropdown}
                    setIsDropdown={setIsDropdown}
                    isClipDropdown={true}
                    isArtistDetails={isArtistDetails}
                    currClip={currClip}
                    currStation={currStation}
                    onRemoveClip={onRemoveClip}
                    onAddClip={onAddClip}
                />}
            </section>
        </li >
}