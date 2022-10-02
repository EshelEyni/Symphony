import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultImg, stationService } from '../services/station.service.js'
import { SearchBar } from '../cmps/search-bar'
import { loadStations, removeStation, updateStation } from '../store/station.actions'
import { computeColor, defaultBgcolor } from '../services/bg-color.service.js'
import { DraggableClipList } from '../cmps/draggable-clip-list.jsx'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { setUserMsg, updateUser } from '../store/user.actions.js'
import { handleDragEnd } from '../services/dragg.service.js'
import { msg, clearMsg, userService } from '../services/user.service'
import { ClipList } from '../cmps/clip-list.jsx'
import { StationHeader } from '../cmps/station-header.jsx'
import { ClipListHeader } from '../cmps/clip-list-header.jsx'
import { SearchList } from '../cmps/search-list.jsx'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { addDesc, addTag, setArtistStation } from '../services/admin-service.js'
import { socketService, USER_FORMATED_PLAYLIST, USER_REGISTERED_TO_PLAYLIST } from '../services/socket.service.js'
import { getDate } from '../services/clip.service.js'

export const StationDetails = () => {
    const loggedInUser = userService.getLoggedinUser()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [currStation, setCurrStation] = useState()
    const params = useParams()
    const [imgUrl, setImgUrl] = useState() // maybe this asswell 
    let [searchClips, setSearchClips] = useState([])
    let [currStationClips, setCurrStationsClips] = useState() // to delete hook
    let [stationBgcolor, setStationBgcolor] = useState(defaultBgcolor)
    let [isAdminMode, setAdminMode] = useState(false)
    const [searchTerm, setSearchTerm] = useState()

    const key = loggedInUser?._id === currStation?.createdBy?._id ? 'user-clip' : 'clip'

    console.log('currStation', currStation?.imgUrl)

    useEffect(() => {
        loadStation(params)
    }, [params])

    useEffect(() => {
        dispatch(setHeaderBgcolor(stationBgcolor))
        if (currStation && currStation?.bgColor === undefined) {
            computeColor(currStation?.imgUrl)
                .then(color => {
                    currStation.bgColor = color
                    dispatch(updateStation(currStation))
                    setStationBgcolor(color)
                })
                .catch(error => {
                    console.log('failed to compute color for img: ' + error)
                })
        }
    }, [stationBgcolor, currStation])

    // Supports socket service
    useEffect(() => {
        socketService.emit(USER_REGISTERED_TO_PLAYLIST, currStation?._id)
        socketService.on('TEST', data => console.log('data', data))
        socketService.on(USER_FORMATED_PLAYLIST, stationCreatorUpdate)
        return () => {
            socketService.off(USER_REGISTERED_TO_PLAYLIST)
            socketService.off(USER_FORMATED_PLAYLIST)
        }
    }, [loggedInUser])

    const stationCreatorUpdate = (newClipsOrder) => {
        setCurrStationsClips([...newClipsOrder])
    }

    const loadStation = async (params) => {
        const id = params.id

        const currStation = await stationService.getById(id)

        setCurrStation(currStation)

        setCurrStationsClips(currStation.clips)

        setImgUrl(currStation?.imgUrl)

        setStationBgcolor(currStation.bgColor)

        if (!currStation.bgColor) {
            computeColor(currStation?.imgUrl)
                .then(color => {
                    currStation.bgColor = color
                    dispatch(updateStation(currStation))
                    setStationBgcolor(color)
                })
                .catch(error => {
                    console.log('failed to compute color for img: ' + error)
                })
        }
    }

    const onRemoveStation = () => {
        dispatch(removeStation(currStation._id))
        dispatch(setUserMsg(msg(currStation.name, ' removed from your library')))
        setTimeout(() => {
            dispatch(setUserMsg(clearMsg))
        }, 2500)
        loggedInUser.createdStations = loggedInUser.createdStations.filter(playlistId => playlistId !== currStation._id)
        dispatch(updateUser(loggedInUser))
        navigate('/library')
    }

    const onSaveSearchStation = async () => {
        const stationToSave = { ...currStation }
        delete stationToSave._id
        delete stationToSave.isSearch
        await stationService.save(stationToSave)
        dispatch(loadStations())
    }

    const onAddClip = async (addedClip) => {
        if (currStation.clips.find(clip => clip._id === addedClip._id)) {
            dispatch(setUserMsg(msg(addedClip.title, ' Is already in ', currStation.name)))
            setTimeout(async () => {
                dispatch(setUserMsg(clearMsg))
            }, 2500);
            return
        }
        const stationToUpdate = { ...currStation }
        console.log('stationToUpdate onAddClip', stationToUpdate?.name)
        addedClip.createdAt = new Date(getDate()).toLocaleDateString()
        stationToUpdate.clips.push(addedClip)
        setCurrStation(stationToUpdate)
        setCurrStationsClips(stationToUpdate.clips)
        dispatch(updateStation(currStation))
        dispatch(setUserMsg(msg(addedClip.title, ' added to ' + currStation.name)))
        setTimeout(async () => {
            dispatch(setUserMsg(clearMsg))
        }, 2500);
    }


    const onRemoveClip = (ev, clipId, clipTitle) => {
        ev.stopPropagation()
        currStation.clips = currStation.clips.filter(clip => clip._id !== clipId)
        setCurrStation({ ...currStation })
        dispatch(updateStation(currStation))
        dispatch(setUserMsg(msg(clipTitle, ' removed from ' + currStation.name)))
        setTimeout(() => {
            dispatch(setUserMsg(clearMsg))
        }, 2500)
    }

    const onHandleDragEnd = (res) => {
        let { clips } = currStation
        currStation.clips = handleDragEnd(res, clips)
        setCurrStationsClips(currStation.clips)
        dispatch(updateStation(currStation))
        socketService.emit(USER_FORMATED_PLAYLIST, {
            _id: currStation._id,
            currClips: currStation.clips
        })
    }

    const onAdminSaveStation = (station) => {
        if (station.tags.length === 0) return alert('Please enter tags to station...')
        if (!station.desc) return alert('Please enter a description to station...')
        station.createdBy = {
            _id: 'a101',
            username: 'Symphony',
            fullname: 'Symphony'
        }

        dispatch(updateStation(station))
    }

    const onSetArtistStation = (station) => {
        const updatedStation = setArtistStation(station)
        setCurrStation({ ...updatedStation })
    }

    const onAddTag = (station) => {
        addTag(station)
    }

    const onAddDesc = (station) => {
        addDesc(station)
    }

    return (
        <div className='station-container'>
            {currStation && <div className='station-main-container'>
                <StationHeader
                    currStation={currStation}
                    setCurrStation={setCurrStation}
                    isUserStation={currStation?.createdBy?._id === loggedInUser?._id}
                    imgUrl={imgUrl}
                    setImgUrl={setImgUrl}
                    bgColor={stationBgcolor}
                    setBgcolor={setStationBgcolor}
                    isAdminMode={isAdminMode}
                    setAdminMode={setAdminMode}
                    onSaveSearchStation={onSaveSearchStation}
                    onRemoveStation={onRemoveStation}
                />

                {/********************************* Admin Control  *********************************/}
                {isAdminMode &&
                    <div className="admin-control-set">
                        <button onClick={() => onAdminSaveStation(currStation)}>Save With Admin Mode</button>
                        <button onClick={() => onAddTag(currStation)}>Add Tag</button>
                        <button onClick={() => onAddDesc(currStation)}>Add Desc</button>
                        <button onClick={() => onSetArtistStation(currStation)}>Set Artist Mode</button>
                    </div>
                }

                <div className='station-clips-container'>
                    <ClipListHeader
                        bgColor={stationBgcolor}
                        station={currStation}
                        user={loggedInUser} />
                    <hr style={{ backgroundColor: stationBgcolor ? stationBgcolor : '#121212' }}></hr>
                    {key === 'clip' &&
                        <ClipList
                            clipKey={key}
                            bgColor={stationBgcolor}
                            currClips={currStationClips}
                            setCurrClips={setCurrStationsClips}
                            station={currStation}
                            onRemoveClip={onRemoveClip}
                        />}
                    {/* --------------------------------------- User Station Only Proporties --------------------------------------- */}
                    {key === 'user-clip' &&
                        <DragDropContext onDragEnd={onHandleDragEnd}>
                            <Droppable droppableId='station-clips-main-container'>
                                {(provided) => (
                                    <DraggableClipList
                                        clipKey={key}
                                        provided={provided}
                                        bgColor={stationBgcolor}
                                        currClips={currStationClips}
                                        setCurrClips={setCurrStationsClips}
                                        station={currStation}
                                        onRemoveClip={onRemoveClip}
                                    />)}
                            </Droppable>
                        </DragDropContext>}
                </div>

                <hr />
                {key === 'user-clip' &&
                    <div className='station-search-container'>
                        <h1 className='station-search-header'>
                            Let's find something for your playlist
                        </h1>
                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            isStationDetails={true}
                            setSearchClips={setSearchClips}
                        />
                        {searchClips.length > 0 &&
                            <SearchList
                                type={'user-search-res'}
                                searchClips={searchClips}
                                setCurrStationsClips={setCurrStationsClips}
                                currStation={currStation}
                                onAddClip={onAddClip}
                                setCurrStation={setCurrStation}
                            />
                        }
                    </div>}
            </div>}
        </div>
    )
}
