import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loadStations, addStation } from '../store/station.actions'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Logo from '../assets/img/note-logo.png'
import { UserStationList } from './user-station-list'
import { NavBar } from './nav-bar'
import { handleDragEnd } from '../services/dragg.service'
import { updateUser } from '../store/user.actions'
import { save } from '../services/station.service'

export const SideBar = () => {
    const stations = useSelector(state => state.stationModule.stations)
    let [userStations, setUserStations] = useState(null)
    const user = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let [isLoginMsg, setIsLoginMsg] = useState(false)
    let [isAddStation, setIsAddStation] = useState(true)

    useEffect(() => {
        dispatch(loadStations())
    }, [user])

    useEffect(() => {
        if (user) {
            userStations = stations.filter(station => (station?.createdBy?._id === user?._id && !station.isSearch)).reverse()
            setUserStations(userStations)
            setIsAddStation(true)
        }
    }, [stations])


    const onAddStation = async () => {
        if (!user) return
        setIsAddStation(false)

        // when connecting to backend change this object        
        let newStation = {
            name: 'My Playlist #' + ((userStations?.length + 1) || 1),
            createdBy: {
                _id: user._id,
                fullname: user.fullname,
                imgUrl: user.imgUrl
            }
        }
        const addedStation = await save(newStation)
        dispatch(addStation(addedStation))
        user.createdStations.push(addedStation._id)
        dispatch(updateUser(user))
        navigate('/station/' + addedStation._id)
    }

    const onHandleDragEnd = (res) => {
        const items = handleDragEnd(res, userStations)
        setUserStations(items)
    }

    return (
        <nav className='sidebar' >
            <Link
                to='/'
                title='Symphony'
            >
                <div className='logo-container'>
                    <div className='logo'><img src={Logo} alt='Logo' /></div>
                    <h1 className='logo-name'>Symphony</h1>
                </div>
            </Link>
            <NavBar
                isLoginMsg={isLoginMsg}
                setIsLoginMsg={setIsLoginMsg}
                isAddStation={isAddStation}
                onAddStation={onAddStation}
                user={user}
            />
            <hr className='hr-navbar' />
            {(userStations && user) &&
                <DragDropContext onDragEnd={onHandleDragEnd}>
                    <Droppable droppableId='user-stations-container'>
                        {(provided) => (
                            <UserStationList
                                provided={provided}
                                userStations={userStations} />
                        )}
                    </Droppable>
                </DragDropContext>
            }
        </nav >
    )
}


