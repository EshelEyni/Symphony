import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Loader } from '../cmps/loader'
import { ProfileList } from '../cmps/profile-list'
import { loadUsers, setWatchedUser } from '../store/user.actions'
import { profileService } from '../services/profile-service'

export const Followers = () => {
    const { users, watchedUser } = useSelector(state => state.userModule)
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (watchedUser?._id !== params._id) dispatch(setWatchedUser(params._id))
        if (!users.length) dispatch(loadUsers())
    }, [watchedUser])

    if (!watchedUser?._id !== params._id && !users.length) {
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )
    }

    if (watchedUser && users.length > 0) {
        return (
            <main>
                <h1>Followers</h1>
                <ProfileList
                    profiles={profileService.getUserProfiles(users, watchedUser, 'followers')}
                    profileKey={'followers-details-'}
                />
            </main>
        )
    }
}