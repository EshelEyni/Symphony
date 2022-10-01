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
import { save, stationService } from '../services/station.service'

export const SideBar = () => {
    const stations = useSelector(state => state.stationModule.stations)
    const loggedInUser = useSelector(state => state.userModule.user)
    let [userStations, setUserStations] = useState(stations
        .filter(station => (station?.createdBy?._id === loggedInUser?._id && !station.isSearch))
        .reverse())
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let [isLoginMsg, setIsLoginMsg] = useState(false)
    let [isAddStation, setIsAddStation] = useState(true)


    useEffect(() => {
        if (loggedInUser) {
            const updatedUserStations = stations.filter(station => (
                station?.createdBy?._id === loggedInUser?._id &&
                !station.isSearch)).reverse()
            setUserStations(updatedUserStations)
            setIsAddStation(true)
        }
    }, [stations])


    const onAddStation = async () => {
        if (!loggedInUser) return
        setIsAddStation(false)

        const newStation = {
            name: 'My Playlist #' + ((userStations?.length + 1) || 1),
            createdBy: {
                _id: loggedInUser._id,
                fullname: loggedInUser.fullname,
                imgUrl: loggedInUser.imgUrl
            }
        }
        const savedStation = await stationService.save(newStation)
        dispatch(addStation(savedStation))
        const userToUpdate = {...loggedInUser}
        userToUpdate.createdStations.push(savedStation._id)
        dispatch(updateUser(userToUpdate))
        navigate('/station/' + savedStation._id)
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


