import { useEffect } from "react"
import { ClipPreview } from "./clip-preview"

export const ClipList = ({ clipKey, station, clips, onPlayClip, onRemoveClip, bgColor = null }) => {

    return <ul className='ms-clips-main-container'>
        {clips.map((clip, idx) => (
            <ClipPreview
                key={clipKey + idx}
                bgColor={idx === 0 ? bgColor : null}
                clip={clip}
                idx={idx}
                station={station}
                onPlayClip={onPlayClip}
                onRemoveClip={onRemoveClip}
            />
        ))
        }
    </ul>
}


