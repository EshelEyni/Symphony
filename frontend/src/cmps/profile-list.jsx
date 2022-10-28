import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProfilePreview } from './profile-preview'

export const ProfileList = ({
    profiles,
    profileKey,
    isArtistByLike,
    isArtistDetails,
    isFollowing,
    isFollowers,
    isLimitedDisplay

}) => {
    const { watchedUser } = useSelector(state => state.userModule)
    const { watchedArtist } = useSelector(state => state.artistModule)
    const isSeeAllLink = profiles.length > 8 ? true : false
    const profilesForDisplay = (profiles.length > 8 && isLimitedDisplay) ? profiles.slice(0, 8) : profiles

    const links = [
        { condition: isArtistByLike, path: '/artist-by-likes/' + watchedUser?._id },
        { condition: isArtistDetails, path: '/artist-profiles/' + watchedArtist?._id },
        { condition: isFollowers, path: '/followers/' + watchedUser?._id },
        { condition: isFollowing, path: '/following/' + watchedUser?._id },
    ]

    if (profiles) {
        return (
            <section className='profile-list-container flex'>
                {links.map(link => (
                    (link.condition && isSeeAllLink) && <Link key={link.path} to={link.path}>See all</Link>
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