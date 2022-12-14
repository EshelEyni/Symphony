import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { ClipList } from '../cmps/clip-list.jsx'
import { StationHeader } from '../cmps/station-header.jsx'
import { SearchBar } from '../cmps/search-bar'
import { Loader } from '../cmps/loader.jsx'
import { loadStation, loadStations, removeStation, updateStation } from '../store/station.actions'
import { setUserMsg, updateUser } from '../store/user.actions.js'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { stationService } from '../services/station.service.js'
import { defaultBgcolor, defaultHeaderBgcolor } from '../services/bg-color.service.js'
import { socketService, SOCKET_EVENT_STATION_UPDATED } from '../services/socket.service.js'
import { AdminControlSet } from '../cmps/admin-control-set.jsx'

export const StationDetails = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { currStation } = useSelector(state => state.stationModule)

    const [currClips, setCurrClips] = useState([])
    const [searchClips, setSearchClips] = useState([])
    const [stationBgcolor, setStationBgcolor] = useState(defaultBgcolor)
    const [isAdminMode, setAdminMode] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [isPostSearch, setIsPostSearch] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const isUserCreatedStation = loggedinUser?._id === currStation?.createdBy?._id

    useEffect(() => {
        if (currStation?._id !== params._id) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
            dispatch(loadStation('clear-station'))
            setSearchClips([])
            setSearchTerm('')
            setIsPostSearch(false)
            dispatch(loadStation(params._id))
        }
    }, [params])

    useEffect(() => {
        if (currStation?._id === params._id) {
            dispatch(setHeaderBgcolor(currStation.bgColor))
            setStationBgcolor(currStation.bgColor)
            setCurrClips(currStation.clips)
            setSearchTerm('')
        }
        return () => {
            dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        }

    }, [currStation])

    useEffect(() => {
        if (currStation?._id === params._id) {
            return () => {
                socketService.off(SOCKET_EVENT_STATION_UPDATED)
                dispatch(loadStation('clear-station'))
            }
        }
    }, [])

    const onTogglePublicStation = () => {
        const isPublicStation = loggedinUser?.publicStations.includes(currStation?._id)
        const userToUpdate = { ...loggedinUser }
        if (!isPublicStation) userToUpdate.publicStations.push(currStation._id)
        else userToUpdate.publicStations = userToUpdate.publicStations.filter(id => id !== currStation._id)
        dispatch(updateUser(userToUpdate))
    }

    const onSaveSearchStation = async () => {
        const stationToSave = { ...currStation }
        delete stationToSave._id
        delete stationToSave.isSearch
        const savedStation = await stationService.save(stationToSave)
        dispatch(loadStations())
        const userToUpdate = { ...loggedinUser }
        userToUpdate.createdStations.unshift(savedStation._id)
        dispatch(updateUser(userToUpdate))
    }

    const onRemoveStation = async () => {
        dispatch(removeStation(currStation._id))
        dispatch(setUserMsg(currStation.name + ' removed from your library'))
        setTimeout(() => dispatch(setUserMsg(null)), 2500)
        loggedinUser.createdStations = loggedinUser.createdStations.filter(id => id !== currStation._id)
        await dispatch(updateUser(loggedinUser))
        navigate('/library')
    }

    const onAddClip = async (addedClip, stationId) => {
        const stationToUpdate = !stationId ? { ...currStation } : await stationService.getById(stationId)
        if (stationToUpdate.clips.find(clip => clip._id === addedClip._id)) {
            dispatch(setUserMsg('This song was already added'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
            return
        }
        stationToUpdate.clips.push({ ...addedClip, createdAt: Date.now() })
        if (!stationId) dispatch(updateStation(stationToUpdate))
        else stationService.save(stationToUpdate)
        dispatch(setUserMsg('Added to ' + stationToUpdate.name))
        setTimeout(() => dispatch(setUserMsg(null)), 2500)
    }

    const onRemoveClip = (ev, clipId) => {
        ev.stopPropagation()
        currStation.clips = currStation.clips.filter(clip => clip._id !== clipId)
        dispatch(updateStation(currStation))
        dispatch(setUserMsg('Song removed from ' + currStation.name))
        setTimeout(() => dispatch(setUserMsg(null)), 2500)
    }

    if (currStation?._id !== params._id) {
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )
    }

    if (currStation && currStation?._id === params._id) {
        return (
            <main className='station-details'
                style={{ backgroundColor: stationBgcolor }}>
                <div className='station-details-main-container'>
                    <StationHeader
                        currStation={currStation}
                        bgColor={stationBgcolor}
                        setBgcolor={setStationBgcolor}
                        isAdminMode={isAdminMode}
                        setAdminMode={setAdminMode}
                        onSaveSearchStation={onSaveSearchStation}
                        onTogglePublicStation={onTogglePublicStation}
                        onRemoveStation={onRemoveStation}
                    />

                    {/********************************* Admin Control  *********************************/}
                    {isAdminMode &&
                        <AdminControlSet
                            currStation={currStation} />}

                    <div className='clips-list'>
                        <ClipList
                            clipKey={'station-clip-'}
                            isUserCreatedStation={isUserCreatedStation}
                            isStation={true}
                            currStation={currStation}
                            currClips={currClips}
                            setCurrClips={setCurrClips}
                            onAddClip={onAddClip}
                            onRemoveClip={onRemoveClip}
                        />
                        <hr />
                    </div>


                    {/********************************* Search Bar && List  *********************************/}

                    {isUserCreatedStation &&
                        <div className='station-search-container'>
                            <h1 className='station-search-header'>
                                Let's find something for your playlist
                            </h1>
                            <SearchBar
                                isPostSearch={isPostSearch}
                                setIsPostSearch={setIsPostSearch}
                                isSearchLoading={isSearchLoading}
                                setIsSearchLoading={setIsSearchLoading}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                isStationDetails={true}
                                setSearchClips={setSearchClips}
                            />

                            {isSearchLoading && <Loader
                                size={'medium-loader'}
                                loaderType={'search-loader'}
                            />}

                            {(isPostSearch && searchClips.length > 0 && !isSearchLoading) &&
                                <ClipList
                                    isUserCreatedStation={isUserCreatedStation}
                                    clipKey={'station-search-res'}
                                    isStationSearch={true}
                                    currClips={searchClips}
                                    setCurrClips={setSearchClips}
                                    currStation={currStation}
                                    onAddClip={onAddClip}
                                />}
                        </div>}
                </div>
            </main>
        )
    }
}