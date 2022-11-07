import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { ClipPreview } from './clip-preview'
import { InStationSearchResult } from './in-station-search-res'
import { updateStation } from '../store/station.actions'
import { handleDragEnd } from '../services/dragg.service'
import { updateUser } from '../store/user.actions'
import { defaultLightGreenColor } from '../services/bg-color.service'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'

export const ClipList = ({
    currStation,
    currClips,
    setCurrClips,
    clipKey,
    onAddClip,
    onRemoveClip,
    searchTerm,
    isLike,
    isSearch,
    isStationSearch,
    isStation,
    isArtistDetails,
    isUserCreatedStation,
    isRecentlyPlayed
}) => {

    const { loggedinUser } = useSelector(state => state.userModule)
    const { stations } = useSelector(state => state.stationModule)
    const dispatch = useDispatch()

    const onHandleDragEnd = (res) => {
        if (isLike) {
            let { clips } = currStation
            const userToUpdate = { ...loggedinUser }
            currStation.clips = handleDragEnd(res, clips)
            setCurrClips(currStation.clips)
            userToUpdate.likedSongs.clips = currStation.clips
            dispatch(updateUser(userToUpdate))
        }

        if (isRecentlyPlayed) {
            let { clips } = currStation
            const userToUpdate = { ...loggedinUser }
            currStation.clips = handleDragEnd(res, clips)
            setCurrClips(currStation.clips)
            userToUpdate.recentlyPlayedClips = currStation.clips
            dispatch(updateUser(userToUpdate))
        }

        if (isSearch) {
            let clipsToUpdate = { ...currClips }
            clipsToUpdate = handleDragEnd(res, currClips)
            setCurrClips(clipsToUpdate)

            if (loggedinUser) {
                const userToUpdate = { ...loggedinUser }
                const searchStationToUpdateId = userToUpdate.recentSearches
                    .find(rs => rs.title === searchTerm)._id
                const searchStationToUpdate = [...stations]
                    .filter(station => station.isSearch === true)
                    .find(station => station._id === searchStationToUpdateId)
                searchStationToUpdate.clips = clipsToUpdate
                dispatch(updateStation(searchStationToUpdate))
            }
        }

        if (isStation) {
            const stationToUpdate = { ...currStation }
            stationToUpdate.clips = handleDragEnd(res, currClips)
            setCurrClips(stationToUpdate.clips)
            if (isUserCreatedStation)
                dispatch(updateStation(stationToUpdate))
        }
    }

    const headerTitles = [
        { classname: 'num' },
        { classname: 'title', txt: '# TITLE' },
        { classname: 'artist', txt: 'ARTIST' },
        { classname: 'date', txt: isSearch ? '' : 'DATE ADDED' },
        { classname: 'clock', icon: <AccessTimeOutlinedIcon /> },
    ]

    if (!isStationSearch) {
        return (
            <section className='clips-list'>
                <header
                    className='clip-list-header'>
                    {headerTitles.map((headerTitle, idx) => {
                        return <span
                            key={idx}
                            className={headerTitle.classname}>
                            {headerTitle?.txt}
                            {headerTitle?.icon}
                        </span>
                    })}
                </header>

                <hr />

                <DragDropContext onDragEnd={onHandleDragEnd}>
                    <Droppable droppableId='clips-list-main-container'>
                        {(provided) => (
                            <ul
                                className='clips-list-main-container'
                                {...provided.droppableProps}
                                ref={provided.innerRef}>
                                {currClips.map((clip, idx) => (
                                    <Draggable
                                        key={clipKey + clip._id}
                                        draggableId={clipKey + clip._id}
                                        index={idx}>
                                        {(provided, snapshot) => {
                                            const style = {
                                                ...provided.draggableProps.style,
                                                backgroundColor: snapshot.isDragging ? defaultLightGreenColor : null,
                                                color: snapshot.isDragging ? '#000000' : '',
                                                cursor: snapshot.isDragging ? 'grabbing' : 'default'
                                            }
                                            return (
                                                <article
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className='clip-preview'>
                                                    <ClipPreview
                                                        dndStyle={style}
                                                        idx={idx}
                                                        currStation={currStation}
                                                        currClip={clip}
                                                        isLike={isLike}
                                                        isArtistDetails={isArtistDetails}
                                                        isRecentlyPlayed={isRecentlyPlayed}
                                                        onRemoveClip={onRemoveClip}
                                                        onAddClip={onAddClip}
                                                    />
                                                </article>
                                            )
                                        }}
                                    </Draggable>
                                )
                                )}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </section>
        )
    }

    if (isStationSearch) {
        return (
            <ul className='station-details-search-list flex'>
                {currClips.map(clip => <InStationSearchResult
                    key={'user-search-res' + clip._id}
                    clip={clip}
                    currStation={currStation}
                    onAddClip={onAddClip}
                />)}
            </ul>
        )
    }
}