import { userService } from "./user.service"
export const equalizer = 'https://res.cloudinary.com/dk9b84f0u/image/upload/v1664386983/Symphny/ezgif.com-gif-maker_cbbaoz.gif'


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

export const shortTitle = (clip) => {
    if (!clip) return ''
    const title = clip.title
    const artist = clip.artist
    const checkIfIncluded = title.split(" ").join('').toLowerCase().includes(artist.split(' ').join('').toLowerCase())
    if (checkIfIncluded) {
        let newTitle
        const artistIdx = title.split(" ").join('').toLowerCase().indexOf(artist.split(" ").join('').toLowerCase())
        const titleWithDash = title.includes('-')
        if (titleWithDash) {
            newTitle = artistIdx <= 0 ? title.substring(title.indexOf('-') + 1, title.length) :
                title.substring(0, title.indexOf('-'))
            return newTitle
        }
        else return newTitle = artistIdx <= 0 ? title.substring(title.indexOf(' ') + 1, title.length) :
            title.substring(0, title.indexOf(' '))
    }
    else return clip.title
}