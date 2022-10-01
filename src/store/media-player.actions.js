import { storageService } from '../services/async-storage.service'
import { userService } from '../services/user.service'



export function setClip(clip) {
    if (clip) {
        storageService.save('prevClip', clip)
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
    storageService.put('prevPlaylist', playlist)
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_PLAYLIST', playlist })
        } catch (err) {
            console.log('Cannot set playist', err)
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

export function setCurrTime(currTime) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_CURR_TIME', currTime })
        } catch (err) {
            console.log('Cannot set current time', err)
        }
    }
}

export function setMediaPlayerInterval(interval) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_MEDIA_PLAYER_INTERVAL', interval })
        } catch (err) {
            console.log('Cannot set media player interval', err)
        }
    }
}

export function setPlayerFunc(playerFunc) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_PLAYER_FUNC', playerFunc })
        } catch (err) {
            console.log('Cannot set media player function', err)
        }
    }
}

export function setClipLength(clipLength) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_CLIP_LENGTH', clipLength })
        } catch (err) {
            console.log('Cannot set clip length', err)
        }
    }
}
