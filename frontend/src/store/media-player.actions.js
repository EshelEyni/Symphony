export function setMediaPlayerClip(clip) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_CLIP', clip })
        } catch (err) {
            console.log('Cannot play media', err)
        }
    }
}

export function setPlaylist(playlist) {
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