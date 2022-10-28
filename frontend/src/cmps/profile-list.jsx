import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProfilePreview } from './profile-preview'

export const ProfileList = ({
    profiles,
    profileKey,
    isArtistByLike,
    isFollowing,
    isFollowers,
    isLimitedDisplay

}) => {
    const { watchedUser } = useSelector(state => state.userModule)
    const isSeeAllLink = profiles.length > 8 ? true : false
    const profilesForDisplay = (profiles.length > 8 && isLimitedDisplay) ? profiles.slice(0, 8) : profiles

    const links = [
        { condition: isArtistByLike, path: 'artist-by-likes/' },
        { condition: isFollowers, path: '/followers/' },
        { condition: isFollowing, path: '/following/' }
    ]

    if (profiles) {
        return (
            <section className='profile-list-container flex'>
                {links.map(link => (
                    (link.condition && isSeeAllLink) && <Link key={link.path} to={link.path + watchedUser._id}>See all</Link>
                ))}

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