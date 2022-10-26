import { NavLink } from 'react-router-dom'
import { Draggable } from 'react-beautiful-dnd'
import { defaultGreenColor } from '../services/bg-color.service'


export const UserStationList = ({
    userStations,
    provided, }) => {

    return (<ul
        className='user-stations-container'
        {...provided.droppableProps}
        ref={provided.innerRef} >
        {userStations.map((station, idx) => {
            return (
                <Draggable
                    key={'side-bar-station-' + station?._id}
                    draggableId={'side-bar-station-' + station?._id}
                    index={idx}>
                    {(provided, snapshot) => {
                        const style = {
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? defaultGreenColor : '',
                            padding: snapshot.isDragging ? '7.5px 7.5px 7.5px 12.5px' : '',
                            color: snapshot.isDragging ? '#000000' : '',
                            borderRadius: snapshot.isDragging ? '15px' : '',
                            cursor: snapshot.isDragging ? 'grabbing' : 'default'
                        }
                        return (
                            <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={style}
                            >
                                <NavLink
                                    style={{ color: style?.color }}
                                    to={'station/' + station._id}>
                                    {station.name}
                                </NavLink>
                            </li>
                        )
                    }}
                </Draggable>)
        })}
        {provided.placeholder}
    </ul>)
}