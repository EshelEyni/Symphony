import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { getDate, isLiked } from "../services/clip.service"
import { clearMsg, msg } from "../services/user.service"
import { setUserMsg, updateUser } from "../store/user.actions"

export const LikesBtns = ({ clip }) => {
    const user = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()

    const onLikeSong = (clip) => {
        if (user.likedSongs.find(song => song._id === clip._id )) return
        clip.likedAt = new Date(getDate()).toLocaleDateString()
        user?.likedSongs.push(clip)
        dispatch(updateUser(user))
        dispatch(setUserMsg(msg(clip.title, ' added to liked songs')))
        setTimeout(() => {
            dispatch(setUserMsg(clearMsg))
        }, 2500);
    }

    const onDisLikeSong = (clipId) => {
        user.likedSongs = user.likedSongs.filter(song => song._id !== clipId)
        dispatch(updateUser(user))
        dispatch(setUserMsg(msg(clip.title, ' removed from your liked songs')))
        setTimeout(() => {
            dispatch(setUserMsg(clearMsg))
        }, 2500);
    }

    return (

        <div className="like-btn-container">
            {isLiked(user, clip._id) ? <button
                className='like symbol fas fa-heart green'
                onClick={() => onDisLikeSong(clip._id)}>
            </button> : <button
                className='like symbol fa-regular fa-heart'
                onClick={() => onLikeSong(clip)}>
            </button>
            }
        </div >
    )
}


