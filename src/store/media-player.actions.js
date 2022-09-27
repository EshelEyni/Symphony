import { storageService } from '../services/async-storage.service'

export function playClip(clip, boolean) {
    storageService.put('prevClip', clip)
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_CLIP', clip })
            dispatch({ type: 'SET_IS_PLAYING', boolean })
        } catch (err) {
            console.log('Cannot login', err)
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

