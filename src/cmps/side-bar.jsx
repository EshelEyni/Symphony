import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loadStations, addStation } from '../store/station.actions'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Logo from '../assets/img/note-logo.png'
import { UserStationList } from './user-station-list'
import { NavList } from './nav-list'
import { handleDragEnd } from '../services/dragg.service'
import { updateUser } from '../store/user.actions'
import { save } from '../services/station.service'

export const SideBar = () => {
    const stations = useSelector(state => state.stationModule.stations)
    let [userStations, setUserStations] = useState(null)
    const loggedInUser = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let [isLoginMsg, setIsLoginMsg] = useState(false)
    let [isAddStation, setIsAddStation] = useState(true)

    useEffect(() => {
        dispatch(loadStations())
    }, [loggedInUser])
    
    useEffect(() => {
        if (loggedInUser) {
            const updatedUserStations = stations.filter(station => (station?.createdBy?._id === loggedInUser?._id && !station.isSearch)).reverse()
            setUserStations(updatedUserStations)
            setIsAddStation(true)
        }
    }, [stations])


    const onAddStation = async () => {
        if (!loggedInUser) return
        setIsAddStation(false)

        let newStation = {
            name: 'My Playlist #' + ((userStations?.length + 1) || 1),
            createdBy: {
                _id: loggedInUser._id,
                fullname: loggedInUser.fullname,
                imgUrl: loggedInUser.imgUrl
            }
        }
        const addedStation = await save(newStation)
        dispatch(addStation(addedStation))
        loggedInUser.createdStations.push(addedStation._id)
        dispatch(updateUser(loggedInUser))
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
            <NavList
                isLoginMsg={isLoginMsg}
                setIsLoginMsg={setIsLoginMsg}
                isAddStation={isAddStation}
                onAddStation={onAddStation}
                user={loggedInUser}
            />
            <hr className='hr-navbar' />
            {(userStations && loggedInUser) &&
                <DragDropContext onDragEnd={onHandleDragEnd}>
                    <Droppable droppableId='user-stations-container'>
                        {(provided) => (
                            <UserStationList
                                provided={provided}
                                setUserStations={setUserStations}
                                userStations={userStations} />
                        )}
                    </Droppable>
                </DragDropContext>
            }
        </nav >
    )
}


