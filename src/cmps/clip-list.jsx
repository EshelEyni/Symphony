import { useEffect } from "react"
import { ClipPreview } from "./clip-preview"

export const ClipList = ({ clipKey, station, currClips, onRemoveClip, bgColor = null }) => {


    return <ul className='station-clips-main-container'>
        {currClips?.map((clip, idx) => (
            <ClipPreview
                key={clipKey + idx}
                bgColor={idx === 0 ? bgColor : null}
                clip={clip}
                idx={idx}
                station={station}
                onRemoveClip={onRemoveClip}
            />
        ))
        }
    </ul>
}


