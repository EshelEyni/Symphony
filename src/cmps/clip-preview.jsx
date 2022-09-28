import { useSelector } from 'react-redux'
import { useState } from 'react'
import { getDuration } from '../services/clip.service'
import { LikesBtns } from './likes-btn'
import { ClipDropdown } from './clip-dropdown'
import { defaultBgcolor } from '../services/bg-color.service'
import { useParams } from 'react-router-dom'
const equalizer = 'https://res.cloudinary.com/dk9b84f0u/image/upload/v1664042770/Symphny/ezgif.com-gif-maker_2_fjbpjm.gif'

export const ClipPreview = ({ clip, type, idx, clipNum, station, onPlayClip, onRemoveClip, bgColor, dndStyle, onAddClip }) => {

    const user = useSelector(state => state.userModule.user)
    const currClip = useSelector(state => state.mediaPlayerModule.currClip)
    const isPlaying = useSelector(state => state.mediaPlayerModule.isPlaying)
    const params = window.location.href
    let [isDropdownClip, setIsDropdownClip] = useState(false)

    const isCreatedAt = (type === 'search-res' || type === 'queue-clip')

    const getBgcolor = () => {
        let currBgcolor = defaultBgcolor
        if (bgColor) currBgcolor = bgColor
        if (dndStyle?.backgroundColor) currBgcolor = dndStyle.backgroundColor
        return currBgcolor
    }


    const bgcStr = `linear-dradient(to right,${getBgcolor()},${getBgcolor()})`


    return <li
        style={{
            // backgroundColor: getBgcolor(),
            background: `linear-dradient(180deg, rgba(2,0,36,1) 0%, rgba(18,19,19,0.6348914565826331) 35%, rgba(0,212,255,1) 100%))`,
            color: dndStyle?.color,
            borderRadius: dndStyle?.borderRadius,
            cursor: dndStyle?.cursor,
        }}

        className={'clip-preview-container '}>
        <div className='cp-main-container'>
            <div className='cp-1-container'>
                <i className={'clip-play-btn fas fa-play playing'}
                    onClick={() => onPlayClip(clip)}></i>
                {/* {currClip._id === clip._id && <img className='' src={equalizer} alt='clip-img' />} */}
                <div className='clip-num'>{clipNum ? clipNum : idx + 1}</div>
                <img className='clip-img' src={clip.img?.url} alt='clip-img' />
                <div className='clip-title'>
                    {clip.title}
                </div>
            </div>
            <div className='artist-name'>{clip.artist}</div>
            {!isCreatedAt && <div className='added'>{clip.createdAt || clip.LikedAt}</div>}
            <div className='cp-2-container flex'>
                {user && <LikesBtns clip={clip} station={station} />}
                {getDuration(clip.duration)}
            </div>

            <i
                className='clip-dp-btn fa-solid fa-ellipsis'
                onClick={() => setIsDropdownClip(!isDropdownClip)}>

                {(isDropdownClip) && <ClipDropdown
                    station={station}
                    onRemoveClip={onRemoveClip}
                    clip={clip}
                />}
            </i>
        </div>
    </li >

}