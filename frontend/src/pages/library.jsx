import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { StationList } from '../cmps/station-list'
import { Loader } from '../cmps/loader'
import { addStation, loadStations } from '../store/station.actions'
import { updateUser } from '../store/user.actions'
import { stationService } from '../services/station.service'
import { ReactComponent as LibraryIcon } from '../assets/img/library-playlist-icon.svg'



export const Library = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { stations } = useSelector(state => state.stationModule)

    const userStations = stationService.getUserStations(stations, loggedinUser, 'user-stations')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (!stations.length) dispatch(loadStations())
    }, [])

    const onAddStation = async () => {
        const newStation = {
            name: 'My Playlist #1',
            createdBy: {
                _id: loggedinUser._id,
                username: loggedinUser.username,
                imgUrl: loggedinUser.imgUrl
            }
        }

        const savedStation = await stationService.save(newStation)
        dispatch(addStation(savedStation))
        navigate('/station/' + savedStation._id)

        const userToUpdate = { ...loggedinUser }
        userToUpdate.createdStations.push(savedStation._id)
        dispatch(updateUser(userToUpdate))
    }


    if (!stations.length) {
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )
    }

    if (stations.length > 0) {

        return (
            <section className='library'>

                {!userStations.length &&
                    <main className='flex column align-center justify-center create-1st-playlist'>
                        <LibraryIcon className='library-icon' />
                        <h1> Create your first playlist </h1>
                        <span>It's easy, we'll help you.</span>
                        <button className='btn' onClick={onAddStation}>Create playlist</button>
                    </main>}

                {userStations.length > 0 &&
                    <main>
                        <StationList
                            title={'Playlists'}
                            stations={userStations}
                            isLiked={true}
                            stationKey={'library-station-'}
                        />
                    </main>}
            </section>
        )
    }
}