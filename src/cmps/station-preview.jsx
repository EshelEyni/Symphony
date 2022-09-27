import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { checkImg } from '../services/station.service'
import { userService } from '../services/user.service'
import { playClip, setPlaylist } from '../store/media-player.actions'
import { updateUser } from '../store/user.actions'

export const StationPreview = ({ station }) => {
    const user = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()

    const onPlayClip = () => {
        const clip = station.clips[0]
        dispatch(playClip(clip))
        dispatch(setPlaylist(station.clips))
        userService.setRecentlyPlayed(user, clip)
        dispatch(updateUser(user))
    }

    return <article className='station-preview' >
        
        <Link to={'/station/' + station._id}>
            <div className='station'>
                <div className='img-container'>
                    <img src={station.imgUrl} alt={station['logo-desc']} />
                    <button className={'play-btn ' + ('fas fa-play playing')}
                        onClick={onPlayClip}></button>
                </div>
                <div className='desc-container flex column space-between'>
                    <div>
                        <h4>{station.name}</h4>
                    </div>
                    <div>
                        <p className='fs12'>{station.desc}</p>
                    </div>


                </div>
            </div>
        </Link>
    </article>
}