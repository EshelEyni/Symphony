import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { UserStationList } from './user-station-list'
import { addStation, loadStations } from '../store/station.actions'
import { updateUser } from '../store/user.actions'
import { NavList } from './nav-list'
import { handleDragEnd } from '../services/dragg.service'
import { stationService } from '../services/station.service'
import { userService } from '../services/user.service'
import Logo from '../assets/img/note-logo.png'

export const SideBar = () => {
    const loggedinUser = userService.getLoggedinUser()
    const { user } = useSelector(state => state.userModule)
    const { stations, currStation } = useSelector(state => state.stationModule)
    const [userStations, setUserStations] = useState(stationService.getUserStations(stations, loggedinUser, 'user-stations'))
    const [isLoginMsg, setIsLoginMsg] = useState(false)
    const [isAddStation, setIsAddStation] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedinUser) {
            const updatedUserStations = stationService.getUserStations(stations, loggedinUser, 'user-stations')
            setUserStations(updatedUserStations)
            setIsAddStation(true)
        }
    }, [stations, user])

    useEffect(() => {
        dispatch(loadStations())
    }, [isAddStation, currStation])

    const onAddStation = async () => {
        if (!loggedinUser) return
        setIsAddStation(false)
        const newStation = {
            name: 'My Playlist #' + (userStations.length + 1),
            createdBy: {
                _id: loggedinUser._id,
                username: loggedinUser.username,
                fullname: loggedinUser.fullname,
            }
        }
        const savedStation = await stationService.save(newStation)
        dispatch(addStation(savedStation))
        const userToUpdate = { ...loggedinUser }
        userToUpdate.createdStations.unshift(savedStation._id)
        dispatch(updateUser(userToUpdate))
        navigate('/station/' + savedStation._id)
    }

    const onHandleDragEnd = (res) => {
        const userToUpdate = { ...loggedinUser }
        const updatedUserStations = handleDragEnd(res, userStations)
        setUserStations(updatedUserStations)
        userToUpdate.createdStations = updatedUserStations.map(station => station._id)
        dispatch(updateUser(userToUpdate))
    }

    return (
        <nav className='sidebar' >
            <Link
                to='/'
                title='Symphony'
            >
                <section className='logo-container'>
                    <h1 className='logo-name'>Symphony</h1>
                    <section className='logo'><img src={Logo} alt='Logo' /></section>
                </section>
            </Link>
            <NavList
                loggedinUser={loggedinUser}
                isAddStation={isAddStation}
                onAddStation={onAddStation}
                isLoginMsg={isLoginMsg}
                setIsLoginMsg={setIsLoginMsg}
            />
            <hr className='navbar-hr' />
            {(userStations && loggedinUser) &&
                <DragDropContext onDragEnd={onHandleDragEnd}>
                    <Droppable droppableId='user-stations-container'>
                        {(provided) => (
                            <UserStationList
                                provided={provided}
                                userStations={userStations}
                                setUserStations={setUserStations}
                                stationKey={'side-bar-station '}
                            />
                        )}
                    </Droppable>
                </DragDropContext>
            }
        </nav >
    )
}