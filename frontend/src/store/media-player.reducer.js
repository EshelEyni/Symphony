
import { mediaPlayerService } from '../services/media-player.service'

const initialState = {
    currMediaPlayerClip: mediaPlayerService.getPrevClip(),
    currPlaylist: mediaPlayerService.getPrevPlaylist(),
    isPlaying: false,
    togglePlayFunc: null,
}

export function MediaPlayerReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CLIP':
            return { ...state, currMediaPlayerClip: action.clip }
        case 'SET_PLAYLIST':
            return { ...state, currPlaylist: action.playlist }
        case 'SET_IS_PLAYING':
            return { ...state, isPlaying: action.isPlaying }
        case 'SET_TOGGLE_PLAY_FUNC':
            return { ...state, togglePlayFunc: action.togglePlayFunc }
        case 'SET_PLAYER_FUNC':
            return { ...state, playerFunc: action.playerFunc }
        default:
            return state
    }
}