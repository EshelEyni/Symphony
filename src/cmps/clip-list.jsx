import { useEffect } from "react"
import { ClipPreview } from "./clip-preview"

export const ClipList = ({ clipKey, station, currClips, onTogglePlay, onRemoveClip, bgColor = null }) => {

    useEffect(() => {
        // console.log('clips', currClips)
    }, [currClips])

    return <ul className='station-clips-main-container'>
        {currClips?.map((clip, idx) => (
            <ClipPreview
                key={clipKey + idx}
                bgColor={idx === 0 ? bgColor : null}
                clip={clip}
                idx={idx}
                station={station}
                onTogglePlay={onTogglePlay}
                onRemoveClip={onRemoveClip}
            />
        ))
        }
    </ul>
}


