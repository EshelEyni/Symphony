import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultImg, stationService } from '../services/station.service.js'
import { SearchBar } from '../cmps/search-bar'
import { loadStations, removeStation, updateStation } from '../store/station.actions'
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from '../store/media-player.actions.js'
import { computeColor, stationHeaderDefaultBgcolor } from '../services/bg-color.service.js'
import { DraggableClipList } from '../cmps/draggable-clip-list.jsx'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { setUserMsg, updateUser } from '../store/user.actions.js'
import { handleDragEnd } from '../services/dragg.service.js'
import { msg, clearMsg } from '../services/user.service'
import { ClipList } from '../cmps/clip-list.jsx'
import { StationHeader } from '../cmps/station-header.jsx'
import { ClipListHeader } from '../cmps/clip-list-header.jsx'
import { SearchList } from '../cmps/search-list.jsx'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { addDesc, addTag, setArtistStation } from '../services/admin-service.js'
import { socketService, USER_FORMATED_PLAYLIST, USER_REGISTERED_TO_PLAYLIST } from '../services/socket.service.js'
import { storageService } from '../services/async-storage.service.js'

export const StationDetails = () => {
    const loggedInUser = useSelector(state => state.userModule.user)
    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [currStation, setCurrStation] = useState()
    const params = useParams()
    const [imgUrl, setImgUrl] = useState()
    let [searchClips, setSearchClips] = useState([])
    let [currStationClips, setCurrStationsClips] = useState()
    let [stationBgcolor, setStationBgcolor] = useState(stationHeaderDefaultBgcolor)
    let [isAdminMode, setAdminMode] = useState(false)
    const [searchTerm, setSearchTerm] = useState()

    const key = loggedInUser?._id === currStation?.createdBy?._id ? 'user-clip' : 'clip'

    useEffect(() => {
        loadStation(params)
    }, [params])

    // Supports color app-header bg
    useEffect(() => {
        dispatch(setHeaderBgcolor(stationBgcolor))
    }, [stationBgcolor])

    // Supports socket service
    useEffect(() => {
        // if (user?._id !== station?.createdBy?._id) {
        socketService.emit(USER_REGISTERED_TO_PLAYLIST, currStation?._id)

        socketService.on('TEST', data => console.log('data', data))

        socketService.on(USER_FORMATED_PLAYLIST, stationCreatorUpdate)
        // }
        return () => {
            socketService.off(USER_REGISTERED_TO_PLAYLIST)
            socketService.off(USER_FORMATED_PLAYLIST)
        }
    }, [loggedInUser])

    const stationCreatorUpdate = (newClipsOrder) => {
        setCurrStationsClips([...newClipsOrder])
    }

    const loadStation = async (params) => {
        console.log('params', params)
        const id = params.id
        const currStation = await stationService.getById(id)
        setCurrStation(currStation)
        setCurrStationsClips(currStation.clips)
        setImgUrl(currStation?.imgUrl || defaultImg)
        setStationBgcolor(currStation.bgColor)
        if (!currStation.bgColor) {
            console.log('currStation.bgColor', currStation.bgColor)
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
        console.log('stationToSave', stationToSave)
        await stationService.save(stationToSave)
        dispatch(loadStations())
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


    const onTogglePlay = async (clip, isClicked) => {
        console.log('clip', clip)
        if (!isClicked) {
            dispatch(setIsPlaying(false))
            clearInterval(mediaPlayerInterval)
            dispatch(setPlaylist(currStation))
            dispatch(setClip(clip))
            dispatch(setMediaPlayerInterval(setInterval(getTime, 750)))
            playerFunc.playVideo()
        }
        if (isClicked) {
            clearInterval(mediaPlayerInterval)
            playerFunc.pauseVideo()
        }
        dispatch(setIsPlaying(!isPlaying))
    }

    const getTime = async () => {
        const time = await playerFunc.getCurrentTime()
        storageService.put('currTime', time)
        dispatch(setCurrTime(time))
        if (currTime > clipLength - 1.5) {
            const currIdx = currPlaylist.clips.indexOf(currClip)
            let nextIdx = currIdx + 1
            if (nextIdx > currPlaylist.clips.length - 1) nextIdx = 0
            currClip = currPlaylist.clips[nextIdx]
        }
        dispatch(setClip(currClip))
        dispatch(setIsPlaying(true))
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
        <div className='my-sd-container'>
            {currStation && <div className='my-sd-main-container'>
                <StationHeader
                    station={currStation}
                    setStation={setCurrStation}
                    isUserStation={currStation?.createdBy?._id === loggedInUser?._id}
                    imgUrl={imgUrl}
                    setImgUrl={setImgUrl}
                    bgColor={stationBgcolor}
                    setBgcolor={setStationBgcolor}
                    isAdminMode={isAdminMode}
                    setAdminMode={setAdminMode}
                    onTogglePlay={onTogglePlay}
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
                            onTogglePlay={onTogglePlay}
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
                                        onTogglePlay={onTogglePlay}
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
                                setCurrStation={setCurrStation}
                            />
                        }
                    </div>}
            </div>}
        </div>
    )
}
