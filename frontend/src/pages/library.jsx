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
    const { user } = useSelector(state => state.userModule)
    const { stations } = useSelector(state => state.stationModule)

    const userStations = stationService.getUserStations(stations, user, 'user-stations')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!stations.length) {
            dispatch(loadStations())
        }
    }, [])

    const onAddStation = async () => {
        const newStation = {
            name: 'My Playlist #1',
            createdBy: {
                _id: user._id,
                username: user.username,
                imgUrl: user.imgUrl
            }
        }

        const savedStation = await stationService.save(newStation)
        dispatch(addStation(savedStation))
        navigate('/station/' + savedStation._id)

        const userToUpdate = { ...user }
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
            <section className='library-container'>
                <h1>
                    LIBRARY
                </h1>

                {!userStations.length &&
                    <main className='flex column align-center justify-center call-to-action'>
                        <LibraryIcon />
                        <div><h1> Create your first playlist </h1></div>
                        <div><span>It's easy, we'll help you.</span></div>
                        <button className='btn' onClick={onAddStation}>Create playlist</button>
                    </main>}

                {userStations.length > 0 &&
                    <main className='main-stations-container'>
                        <StationList
                            stations={userStations}
                            isLiked={true}
                            stationKey={'library-station-'}
                        />
                    </main>}
            </section>
        )
    }
}