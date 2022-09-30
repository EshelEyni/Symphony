import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProfilePreview } from './profile-preview'
import { loadUsers } from '../store/user.actions'
import { loadStations } from '../store/station.actions'
import { getFilteredUsersList } from '../services/profile-service'


export const ProfileList = ({
    currProfiles,
    filterBy,
    searchTerm,
    currUser }) => {

    const usersList = useSelector(state => state.userModule.users)
    const loggedInUser = useSelector(state => state.userModule.user)
    const stations = useSelector(state => state.stationModule.stations)

    const dispatch = useDispatch()
    const ProfileList = getFilteredUsersList(usersList, currUser, filterBy, stations, searchTerm)

    useEffect(() => {
        dispatch(loadUsers())
        dispatch(loadStations())
    }, [searchTerm])

    return (
        <div className='profile-list-container flex'>
            {currProfiles?.map((user, idx) => {
                return <ProfilePreview
                    key={'profile' + idx}
                    user={user} />
            })}

            {!currProfiles?.length &&
                <p>
                    No Profiles were found...
                </p>
            }
        </div>
    )
}

