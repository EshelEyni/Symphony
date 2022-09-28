import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProfilePreview } from './profile-preview'
import { loadUsers } from '../store/user.actions'
import { loadStations } from '../store/station.actions'
import { searchService } from '../services/search.service'
import { getFilteredUsersList } from '../services/profile-service'


export const ProfilesList = ({ filterBy, searchTerm }) => {
    const usersList = useSelector(state => state.userModule.users)
    const loggedInUser = useSelector(state => state.userModule.user)
    const stations = useSelector(state => state.stationModule.stations)
    const dispatch = useDispatch()
    const profilesList = getFilteredUsersList(usersList, loggedInUser, filterBy, stations, searchTerm)

    useEffect(() => {
        dispatch(loadUsers())
        dispatch(loadStations())
    }, [searchTerm])

    return (
        <div className='profile-list-container flex'>
            {profilesList?.map((user, idx) => {
                return <ProfilePreview
                    key={'profile' + idx}
                    user={user} />
            })}

            {profilesList?.length === 0 &&
                <p>
                    No Profiles were found...
                </p>
            }
        </div>
    )
}

