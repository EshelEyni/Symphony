import { ClipPreview } from "./clip-preview"
import { Draggable } from "react-beautiful-dnd"
import { defaultLightGreenColor } from '../services/bg-color.service'

export const DraggableClipList = ({
    station,
    bgColor,
    currClips,
    clipKey,
    onRemoveClip,
    provided }) => {

    return <ul
        className='station-clips-main-container'
        {...provided.droppableProps}
        ref={provided.innerRef}>

        {currClips?.map((clip, idx) => (
            <Draggable
                key={clipKey + idx}
                draggableId={'' + idx}
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
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="clip-preview-container">
                            <ClipPreview
                                dndStyle={style}
                                bgColor={idx === 0 ? bgColor : null}
                                clip={clip}
                                idx={idx}
                                station={station}
                                onRemoveClip={onRemoveClip}
                            />
                        </div>
                    )
                }}
            </Draggable>
        )
        )}
        {provided.placeholder}
    </ul>
}