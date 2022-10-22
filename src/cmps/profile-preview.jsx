import { Link } from 'react-router-dom'
import pic from '../assets/img/blank-user.png'


export const ProfilePreview = ({ user }) => {
    return (
        <article className='profile-preview' >
            <Link to={'/user-profile/' + user?._id}>
                <div className='profile-img-container'>
                    <img
                        className='profile-img'
                        src={user?.imgUrl || pic}
                        alt='user-profile-img' />
                </div>
                <div className='desc-container flex column space-between'>
                    <div>
                        <h4>{user?.username}</h4>
                    </div>
                </div>
            </Link>
        </article>
    )
}