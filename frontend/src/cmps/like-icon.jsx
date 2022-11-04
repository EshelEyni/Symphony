import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserMsg, updateUser } from '../store/user.actions'
import { ReactComponent as HeartIcon } from '../assets/img/heart-icon.svg'
import { updateStation } from '../store/station.actions'

export const LikeIcon = ({
    currStation,
    currClip,
    isMediaPlayer,
    isClipPreview,
    isStationHeader,
    inputId
}) => {

    const {loggedinUser} = useSelector(state => state.userModule)
    const [isLike, setIsLike] = useState(checkIsLike())
    const dispatch = useDispatch()

    useEffect(() => {
        setIsLike(checkIsLike())
    }, [currStation])

    function checkIsLike() {
        if (isClipPreview || isMediaPlayer)
            return loggedinUser.likedSongs.clips.map(song => song?._id).includes(currClip?._id)
        if (isStationHeader)
            return loggedinUser.likedStations.includes(currStation._id)
    }

    const onToggleLike = () => {
        const stationToUpdate = { ...currStation }
        const userToUpdate = { ...loggedinUser }

        if (isClipPreview) {
            if (!checkIsLike()) {
                currClip.likedAt = Date.now()
                currClip.likedByUsers = [userToUpdate._id, ...currClip.likedByUsers]
                userToUpdate.likedSongs.clips = [currClip, ...userToUpdate.likedSongs.clips]
            }
            else {
                currClip.likedAt = ''
                currClip.likedByUsers = currClip.likedByUsers.filter(userId => userId !== userToUpdate._id)
                userToUpdate.likedSongs.clips = userToUpdate.likedSongs.clips.filter(song => song._id !== currClip._id)
            }
        }

        if (isStationHeader) {
            if (!checkIsLike()) {
                stationToUpdate.likedByUsers = [userToUpdate._id, ...stationToUpdate.likedByUsers]
                userToUpdate.likedStations = [stationToUpdate._id, ...userToUpdate.likedStations]
            }
            else {
                stationToUpdate.likedByUsers = stationToUpdate.likedByUsers.filter(userId => userId !== userToUpdate._id)
                userToUpdate.likedStations = userToUpdate.likedStations.filter(stationId => stationId !== stationToUpdate._id)
            }
        }

        dispatch(updateStation(stationToUpdate))
        dispatch(updateUser(userToUpdate))

        if (isClipPreview) {
            dispatch(setUserMsg(checkIsLike() ? 'Added to liked songs' : 'Removed from your liked songs'))
            setTimeout(() => dispatch(setUserMsg(null)), 2500)
        }
    }

    return (
        <section
            className='like-icon'>
            <input
                type='checkbox'
                defaultChecked={isLike}
                id={inputId}
                name='like'
                onClick={onToggleLike}
            />
            <label
                htmlFor={inputId}>
                <HeartIcon />
            </label>
        </section>
    )
}