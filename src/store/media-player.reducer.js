
import { storageService } from '../services/async-storage.service'

const initialState = {
    currClip: storageService.loadFromStorage('prevClip') || null,
    currPlaylist: storageService.loadFromStorage('prevPlaylist')?.[0] || null,
    isPlaying: false,
    currTime: null,
    mediaPlayerInterval: null,
    playerFunc: null,
    clipLength: null,
}

export function MediaPlayerReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CLIP':
            return { ...state, currClip: action.clip }
        case 'SET_PLAYLIST':
            return { ...state, currPlaylist: action.playlist }
        case 'SET_IS_PLAYING':
            return { ...state, isPlaying: action.isPlaying }
        case 'SET_CURR_TIME':
            return { ...state, currTime: action.currTime }
        case 'SET_MEDIA_PLAYER_INTERVAL':
            return { ...state, mediaPlayerInterval: action.interval }
        case 'SET_PLAYER_FUNC':
            return { ...state, playerFunc: action.playerFunc }
        case 'SET_CLIP_LENGTH':
            return { ...state, clipLength: action.clipLength }
        default:
            return state
    }
}