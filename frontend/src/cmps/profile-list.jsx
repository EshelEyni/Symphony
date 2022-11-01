import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { artistService } from '../services/artist.service'
import { ProfilePreview } from './profile-preview'

export const ProfileList = ({
    title,
    profiles,
    profileKey,
    isRandomArtist,
    isArtistByLike,
    isArtistDetails,
    isFollowing,
    isFollowers,
    isLimitedDisplay

}) => {
    const { watchedUser } = useSelector(state => state.userModule)
    const { watchedArtist } = useSelector(state => state.artistModule)
    let profilesForDisplay = useRef()
    const isSeeAllLink = profiles.length > 8 ? true : false
    if (!isRandomArtist) profilesForDisplay.current = (profiles.length > 8 && isLimitedDisplay) ? profiles.slice(0, 8) : profiles
    if (isRandomArtist && !profilesForDisplay.current) profilesForDisplay.current = artistService.getRandomArtists(profiles)

    const links = [
        { condition: isRandomArtist, path: '/artists/' },
        { condition: isArtistByLike, path: '/artist-by-likes/' + watchedUser?._id },
        { condition: isArtistDetails, path: '/artist-profiles/' + watchedArtist?._id },
        { condition: isFollowers, path: '/followers/' + watchedUser?._id },
        { condition: isFollowing, path: '/following/' + watchedUser?._id },
    ]

    if (profiles) {
        return (
            <section className='profile-list'>
                <header className="profile-list-header flex space-between">
                    <h1>{title}</h1>
                    {links.map(link => (
                        (link.condition && isSeeAllLink) && <Link key={link.path} to={link.path}>See all</Link>
                    ))}
                </header>

                <section className='profile-list-main-container grid'>
                    {profilesForDisplay.current.map(user => {
                        return <ProfilePreview
                            key={profileKey + user._id}
                            user={user}
                        />
                    })}
                </section>
            </section>
        )
    }
}