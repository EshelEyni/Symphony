import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { ClipPreview } from '../cmps/clip-preview'
import { setPlaylist } from '../store/media-player.actions'
import { handleDragEnd } from '../services/dragg.service'
import { defaultLightGreenColor } from '../services/bg-color.service'

export const Queue = () => {

    const { currMediaPlayerClip, currPlaylist } = useSelector(state => state.mediaPlayerModule)
    const [queueClipList, setQueueClipList] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!currPlaylist)
            return navigate('/')
        setQueueClipList(setNextUpClips(currPlaylist.clips))
    }, [currPlaylist, currMediaPlayerClip])

    const onHandleDragEnd = (res) => {
        let clipsToUpdate = [...queueClipList]
        clipsToUpdate = handleDragEnd(res, clipsToUpdate)
        setQueueClipList(clipsToUpdate)
        const stationToUpdate = { ...currPlaylist }
        stationToUpdate.clips = [currMediaPlayerClip, ...clipsToUpdate]
        dispatch(setPlaylist(stationToUpdate))
    }

    const setNextUpClips = (clips) => {
        const currMediaPlayerClipIdx = currPlaylist.clips.findIndex(clip => clip._id === currMediaPlayerClip._id)
        let nextUpClips = clips.filter(clip => clip._id !== currMediaPlayerClip._id)
        let before = nextUpClips.splice(0, currMediaPlayerClipIdx)
        nextUpClips.push(...before)
        return nextUpClips
    }

    return (
        <main className='clips-queue-container'>
            <h1>
                Queue
            </h1>

            <h2>Now playing</h2>
            <article>
                <ClipPreview
                    currClip={currMediaPlayerClip}
                    idx={0}
                    clipNum={1} />
            </article>
            <h2>Next up</h2>

            <DragDropContext onDragEnd={onHandleDragEnd}>
                <Droppable droppableId='station-clips-main-container'>
                    {(provided) => (
                        <ul
                            className='station-clips-main-container'
                            {...provided.droppableProps}
                            ref={provided.innerRef}>

                            {queueClipList.map((clip, idx) => (
                                <Draggable
                                    key={'queue-clip' + clip._id}
                                    draggableId={'queue-clip' + clip._id}
                                    index={idx}>
                                    {(provided, snapshot) => {
                                        const style = {
                                            ...provided.draggableProps.style,
                                            backgroundColor: snapshot.isDragging ? defaultLightGreenColor : null,
                                            color: snapshot.isDragging ? '#000000' : '',
                                            // borderRadius: snapshot.isDragging ? '15px' : '',
                                            cursor: snapshot.isDragging ? 'grabbing' : 'default'
                                        }
                                        return (
                                            <article
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className='clip-preview-container'>
                                                <ClipPreview
                                                    dndStyle={style}
                                                    // bgColor={idx === 0 ? bgColor : null}
                                                    currClip={clip}
                                                    idx={idx}
                                                    clipNum={idx + 2}
                                                />
                                            </article>
                                        )
                                    }}
                                </Draggable>
                            )
                            )}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

        </main>
    )
}