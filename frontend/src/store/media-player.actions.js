import { storageService } from '../services/storage.service'
import { userService } from '../services/user.service'

export function setMediaPlayerClip(clip) {
    storageService.saveToStorage('prevClip', clip)

    let userToUpdate = { ...userService.getLoggedinUser() }
    if (userToUpdate) {
        console.log('userToUpdate', userToUpdate)
        userToUpdate = userService.updateUserRecentlyPlayedClips(userToUpdate, clip)
        userToUpdate.prevClip = clip
        userService.update(userToUpdate)
    }

    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_CLIP', clip })
        } catch (err) {
            console.log('Cannot play media', err)
        }
    }
}

export function setPlaylist(playlist) {
    storageService.saveToStorage('prevPlaylist', playlist)

    let userToUpdate = { ...userService.getLoggedinUser() }
    if (userToUpdate) {
        userToUpdate.prevPlaylist = playlist
        userService.update(userToUpdate)
    }

    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_PLAYLIST', playlist })
        } catch (err) {
            console.log('Cannot set playist', err)
        }
    }
}

export function setOnTogglePlay(togglePlayFunc) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_TOGGLE_PLAY_FUNC', togglePlayFunc })
        } catch (err) {
            console.log('Cannot set media player function', err)
        }
    }
}

export function setIsPlaying(isPlaying) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_IS_PLAYING', isPlaying })
        } catch (err) {
            console.log('Cannot set media player', err)
        }
    }
}