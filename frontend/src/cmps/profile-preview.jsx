import { Link } from 'react-router-dom'

export const ProfilePreview = ({
    user,
}) => {

    return (
        <article className='profile-preview' >
            <Link to={(user.isArtist ? '/artist/' : '/profile/') + user?._id}>
                <main className='profile-preview-main-container'>

                    <section className='profile-img-container'>
                        <img
                            className='profile-img'
                            src={user?.imgUrl}
                            alt='user-profile-img' />
                    </section>

                    <section className='desc-container'>
                        <div>
                            <h4>{user?.username}</h4>
                            <p className='fs12'>{user.isArtist ? 'Artist' : 'Profile'}</p>
                        </div>
                    </section>
                </main>
            </Link>
        </article>
    )
}