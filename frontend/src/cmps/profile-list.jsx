import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProfilePreview } from './profile-preview'

export const ProfileList = ({
    profiles,
    profileKey,
    isArtistByLike,
    isLimitedDisplay

}) => {
    const { user } = useSelector(state => state.userModule)
    const isSeeAllLink = profiles.length > 8 ? true : false
    const profilesForDisplay = (profiles.length > 8 && isLimitedDisplay) ? profiles.slice(0, 8) : profiles
    if (profiles) {
        return (
            <section className='profile-list-container flex'>
                {(isArtistByLike && isSeeAllLink) && <Link to={'artist-by-likes/' + user._id}>See all</Link>}
                {profilesForDisplay.map(user => {
                    return <ProfilePreview
                        key={profileKey + user._id}
                        user={user}
                    />
                })}
            </section>
        )
    }
}