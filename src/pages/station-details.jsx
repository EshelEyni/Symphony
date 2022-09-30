import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultImg, getById } from '../services/station.service.js'
import { SearchBar } from '../cmps/search-bar'
import { removeStation, updateStation } from '../store/station.actions'
import { setClip, setCurrTime, setIsPlaying, setMediaPlayerInterval, setPlaylist } from '../store/media-player.actions.js'
import { computeColor, stationHeaderDefaultBgcolor } from '../services/bg-color.service.js'
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
import { addDesc, addTag, setAdminMode, setArtistStation } from '../services/admin-service.js'
import { socketService, USER_FORMATED_PLAYLIST, USER_REGISTERED_TO_PLAYLIST } from '../services/socket.service.js'
import { storageService } from '../services/async-storage.service.js'

export const StationDetails = () => {
    const user = useSelector(state => state.userModule.user)
    const stations = useSelector(state => state.stationModule.stations)
    let { playerFunc, isPlaying, currClip, currPlaylist, mediaPlayerInterval, currTime, clipLength } = useSelector(state => state.mediaPlayerModule)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [station, setStation] = useState()
    const params = useParams()
    const [imgUrl, setImgUrl] = useState()
    let [searchClips, setSearchClips] = useState([])
    let [playtlistClips, setPlaytlistClips] = useState([])
    let [bgColor, setBgcolor] = useState()
    let [isAdminMode, setAdminMode] = useState(false)

    const key = user?._id === station?.createdBy?._id ? 'user-clip' : 'clip'

    useEffect(() => {
        loadStation(params)
    }, [params])

    // Supports loading station from create playlist 
    useEffect(() => {
        loadStation(params)
    }, [stations])

    // Supports color app-header bg
    useEffect(() => {
        dispatch(setHeaderBgcolor(bgColor))
    }, [bgColor])

    // Supports socket service
    useEffect(() => {
        // if (user?._id !== station?.createdBy?._id) {
        socketService.emit(USER_REGISTERED_TO_PLAYLIST, station?._id)

        socketService.on('TEST', data => console.log('data', data))

        socketService.on(USER_FORMATED_PLAYLIST, stationCreatorUpdate)
        // }
        return () => {
            socketService.off(USER_REGISTERED_TO_PLAYLIST)
            socketService.off(USER_FORMATED_PLAYLIST)
        }
    }, [user])

    const stationCreatorUpdate = (newClipsOrder) => {
        setPlaytlistClips([...newClipsOrder])
    }

    const loadStation = async (params) => {
        const id = params.id
        const station = await getById(id)
        setStation(station)
        setImgUrl(station?.imgUrl || defaultImg)
        setPlaytlistClips(station?.clips)
        if (station.imgUrl === defaultImg) setBgcolor(stationHeaderDefaultBgcolor)
        // if (station?.imgUrl) {
        //     computeColor(station?.imgUrl)
        //         .then(color => {
        //             console.log('#03435C', color)
        //             setBgcolor(color)
        //         })
        // }
    }
    const onRemoveStation = () => {
        dispatch(removeStation(station._id))
        dispatch(setUserMsg(msg(station.name, ' removed from your library')))
        setTimeout(() => {
            dispatch(setUserMsg(clearMsg))
        }, 2500)
        user.createdStations = user.createdStations.filter(playlistId => playlistId !== station._id)
        dispatch(updateUser(user))
        navigate('/library')
    }

    const onRemoveClip = (ev, clipId, clipTitle) => {
        ev.stopPropagation()
        station.clips = station.clips.filter(clip => clip._id !== clipId)
        setStation({ ...station })
        dispatch(updateStation(station))
        dispatch(setUserMsg(msg(clipTitle, ' removed from ' + station.name)))
        setTimeout(() => {
            dispatch(setUserMsg(clearMsg))
        }, 2500)
    }


    const onTogglePlay = async (clip, isClicked) => {
        console.log('clip', clip)
        if (!isClicked) {
            dispatch(setIsPlaying(false))
            clearInterval(mediaPlayerInterval)
            dispatch(setPlaylist(station))
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
        let { clips } = station
        station.clips = handleDragEnd(res, clips)
        setPlaytlistClips(station.clips)
        dispatch(updateStation(station))
        socketService.emit(USER_FORMATED_PLAYLIST, {
            _id: station._id,
            currClips: station.clips
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
        setStation({ ...updatedStation })
    }

    const onAddTag = (station) => {
        addTag(station)
    }

    const onAddDesc = (station) => {
        addDesc(station)
    }

    return (
        <div className='my-sd-container'>
            {station && <div className='my-sd-main-container'>
                <StationHeader
                    isAdminMode={isAdminMode}
                    setAdminMode={setAdminMode}
                    onTogglePlay={onTogglePlay}
                    bgColor={bgColor}
                    setBgcolor={setBgcolor}
                    imgUrl={imgUrl}
                    setImgUrl={setImgUrl}
                    isUserStation={station?.createdBy?._id === user?._id}
                    station={station}
                    onRemoveStation={onRemoveStation}
                    setStation={setStation}
                />

                {/********************************* Admin Control  *********************************/}
                {isAdminMode &&
                    <div className="admin-control-set">
                        <button onClick={() => onAdminSaveStation(station)}>Save With Admin Mode</button>
                        <button onClick={() => onAddTag(station)}>Add Tag</button>
                        <button onClick={() => onAddDesc(station)}>Add Desc</button>
                        <button onClick={() => onSetArtistStation(station)}>Set Artist Mode</button>
                    </div>
                }


                <div className='station-clips-container'>
                    <ClipListHeader
                        bgColor={bgColor}
                        station={station}
                        user={user} />
                    <hr style={{ backgroundColor: bgColor ? bgColor : '#121212' }}></hr>
                    {key === 'clip' &&
                        <ClipList
                            clipKey={key}
                            bgColor={bgColor}
                            clips={playtlistClips}
                            station={station}
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
                                        bgColor={bgColor}
                                        clips={playtlistClips}
                                        station={station}
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
                            isStationDetails={true}
                            setClips={setSearchClips}
                        />
                        <SearchList
                            type={'user-search-res'}
                            clips={searchClips}
                            station={station}
                            setStation={setStation}
                        />
                    </div>}
            </div>}
        </div>
    )
}
