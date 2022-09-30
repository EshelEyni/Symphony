import { useEffect } from "react"
import { Draggable } from "react-beautiful-dnd"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { defaultGreenColor } from '../services/bg-color.service'


export const UserStationList = ({
    userStations,
    provided, }) => {

    console.log('userStations', userStations)
    return (<ul
        className='user-stations-container'
        {...provided.droppableProps}
        ref={provided.innerRef} >
        {userStations.map((station, idx) => {
            return (
                <Draggable
                    key={station?._id}
                    draggableId={station?._id}
                    index={idx}>
                    {(provided, snapshot) => {
                        const style = {
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? defaultGreenColor : '',
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
                                    to={'/station/' + station._id}>
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