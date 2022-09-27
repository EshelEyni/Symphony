
import { storageService } from '../services/async-storage.service'

const initialState = {
    currClip: storageService.loadFromStorage('prevClip')?.[0] || null,
    currPlaylist: storageService.loadFromStorage('prevPlaylist')?.[0] || null,
}

export function MediaPlayerReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CLIP':
            return { ...state, currClip: action.clip }
        case 'SET_PLAYLIST':
            return { ...state, currPlaylist: [...action.playlist] }
        default:
            return state

    }
}