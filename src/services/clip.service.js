import { userService } from "./user.service"

const user = userService.getLoggedinUser()

// export const addedAt = (time) => {
//     const timeAdded = new Date(time * 1000).toLocaleDateString('he-IL')
//     return timeAdded
// }

export const getDate = () => {
    const date = Date.now()
    return date
}

export const getDuration = ({ min, sec }) => {
    const str = min + ':' + (sec < 10 ? '0' + sec : sec)
    return str
}

export const onLikeSong = (clip) => {
    clip.createdAt = new Date(getDate()).toLocaleDateString()
    user?.likedSongs.push(clip)
}

export const onDisLikeSong = (clipId) => {
    user.likedSongs = user?.likedSongs.filter(song => song._id !== clipId)
}


export const isLiked = (user, clipId) => {
    if (!user || !clipId) return false
    return user?.likedSongs?.find(song => clipId === song._id)
}