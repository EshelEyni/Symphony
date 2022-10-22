import { storageService } from './storage.service'
import { userService } from './user.service'

export const mediaPlayerService = {
    getFormattedTime,
    getPrevClip,
    getPrevPlaylist
}



function getFormattedTime(duration) {
    let min = Math.floor(duration / 60)
    let sec = Math.ceil(duration % 60)
    if (sec < 10) sec = '0' + sec
    if (sec === 60) {
        sec = '00'
        min++
    }
    return (min + ':' + sec)
}

function getPrevClip() {
    let prevClip = userService.getLoggedinUser()?.prevClip
        || storageService.loadFromStorage('prevClip')
        || null

    return prevClip
}

function getPrevPlaylist() {
    let prevPlaylist = userService.getLoggedinUser()?.prevPlaylist
        || storageService.loadFromStorage('prevPlaylist')
        || null

    return prevPlaylist
}