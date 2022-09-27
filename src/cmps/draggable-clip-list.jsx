import { ClipPreview } from "./clip-preview"
import { Draggable } from "react-beautiful-dnd"
import { defaultGreenColor } from '../services/bg-color.service'

export const DraggableClipList = ({ clipKey, clips, station, onPlayClip, onRemoveClip, bgColor, provided }) => {

    return <ul
        className='ms-clips-main-container'
        {...provided.droppableProps}
        ref={provided.innerRef}>

        {clips?.map((clip, idx) => (
            <Draggable
                key={clipKey + idx}
                draggableId={'' + idx}
                index={idx}>
                {(provided, snapshot) => {
                    const style = {
                        ...provided.draggableProps.style,
                        backgroundColor: snapshot.isDragging ? defaultGreenColor : null,
                        color: snapshot.isDragging ? '#000000' : '',
                        borderRadius: snapshot.isDragging ? '15px' : '',
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
                                onPlayClip={onPlayClip}
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