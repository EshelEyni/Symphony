import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Loader } from '../cmps/loader'
import { ProfileList } from '../cmps/profile-list'
import { loadUsers, setWatchedUser } from '../store/user.actions'
import { profileService } from '../services/profile-service'
import { loadStation } from '../store/station.actions'

export const StationProfilesByLike = () => {
    const { users } = useSelector(state => state.userModule)
    const { currStation } = useSelector(state => state.stationModule)
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (currStation?._id !== params._id) dispatch(loadStation(params._id))
        if (!users.length) dispatch(loadUsers())
    }, [currStation])

    if (!currStation?._id !== params._id && !users.length) {
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )
    }

    if (currStation && users.length > 0) {
        return (
            <main>
                <ProfileList
                    title={currStation.name + '\'s Liked By'}
                    profiles={profileService.getUserByStationLike(currStation, users)}
                    profileKey={'station-profiles-by-like-'}
                />
            </main>
        )
    }
}