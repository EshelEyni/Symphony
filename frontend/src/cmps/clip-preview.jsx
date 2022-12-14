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
            if (currStation._id !== currPlaylist?._id) dispatch(setPlaylist(currStation))
            if (currClip._id !== currMediaPlayerClip?._id) dispatch(setMediaPlayerClip(currClip))
            setIsClicked(true)
        }
        togglePlayFunc()
    }

    const getDateAdded = () => {
        let currTimeStamp = currClip.createdAt
        if (isRecentlyPlayed) currTimeStamp = currClip.playedAt
        if (isLike) currTimeStamp = currClip.likedAt
        return clipService.getTimeStr(currTimeStamp)
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

            <div className='clip-preview-container'>
                <div className='play-btn-container'>
                    <i className={'clip-play-btn ' + (isClicked ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={onTogglePlay}></i>
                    {isCurrClipPlaying ? <Equalizer /> :
                        <span className='clip-num'>{clipNum ? clipNum : idx + 1}</span>}
                </div>

                <section className='clip-title flex align-center'>
                    <div className='clip-img-container'>
                        <img src={currClip.img?.url} alt='clip-img' />
                    </div>
                    <section className='title-text flex column'>
                        <h1 style={{ color: dndStyle?.color }}>{clipService.getFormattedTitle(currClip)}</h1>
                        <p style={{ color: dndStyle?.color }}>{currClip.artist}</p>
                    </section>
                </section>
                <span className='cp-artist-name'>{currClip.artist}</span>
                <span className='cp-date-added' > {getDateAdded()} </span>

                {loggedinUser && <LikeIcon
                    currStation={currStation}
                    currClip={currClip}
                    inputId={currClip._id}
                    isClipPreview={true}
                />}

                {currClip.duration ? <div className='cp-duration'>{clipService.getDuration(currClip.duration) || ''}</div> : ''}

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
            </div>
        </li >
}