import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadUsers } from '../store/user.actions'
import pic from '../assets/img/blank-user.png'


export const ProfilePreview = ({ user }) => {
    const users = useSelector(state => state.userModule.users)
    const dispatch = useDispatch()

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