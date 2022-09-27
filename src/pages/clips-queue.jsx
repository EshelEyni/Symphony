import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { ClipPreview } from '../cmps/clip-preview'
import { queueBgcolor } from '../services/bg-color.service'
import { setHeaderBgcolor } from '../store/app-header.actions'

export const ClipsQueue = () => {
    let currPlaylist = useSelector(state => state.mediaPlayerModule.currPlaylist)
    let currClip = useSelector(state => state.mediaPlayerModule.currClip)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(setHeaderBgcolor(queueBgcolor))
    }, [])

    return (
        <div className='clips-queue-container'>
            <h1>
                Queue
            </h1>

            <ul className='queue-clips-container flex column'>
                <h2>Now playing</h2>
                {currPlaylist && <div>
                    <ClipPreview
                        type={'queue-clip'}
                        clip={currClip}
                        idx={currPlaylist.indexOf(currClip)}
                        clipNum={1} />
                </div>}
                <h2>Next up</h2>
                {currPlaylist.map((clip, idx) => {
                    if (idx === currPlaylist.indexOf(currClip)) return
                    else {
                        return <ClipPreview
                            type={'queue-clip'}
                            key={'queue-clip-' + idx}
                            clip={clip}
                            idx={idx}
                            clipNum={idx + 2} />
                    }
                })}
            </ul>
        </div>
    )
}