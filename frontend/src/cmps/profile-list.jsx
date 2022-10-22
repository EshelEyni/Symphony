import { ProfilePreview } from './profile-preview'

export const ProfileList = ({
    currProfiles,
    isArtist,
    profileKey
}) => {

    if (currProfiles) {
        return (
            <section className='profile-list-container flex'>
                {currProfiles.map(user => {
                    return <ProfilePreview
                        key={profileKey + user._id}
                        user={user}
                        isArtist={isArtist} />
                })}
            </section>
        )
    }
}