import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Loader } from '../cmps/loader'
import { ProfileList } from '../cmps/profile-list'
import { loadUser, loadUsers } from '../store/user.actions'
import { profileService } from '../services/profile-service'

export const FollowersDetails = () => {
    const { users, user } = useSelector(state => state.userModule)
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        if (user?._id !== params._id) dispatch(loadUser(params._id))
        if (!users.length) dispatch(loadUsers())
    }, [user])

    if (!user?._id !== params._id && !users.length) {
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )
    }

    if (user && users.length > 0) {
        return (
            <main>
                <h1>Followers</h1>
                <ProfileList
                    currProfiles={profileService.getUserProfiles(users, user, 'followers')}
                    profileKey={'followers-details-'}
                />
            </main>
        )
    }
}