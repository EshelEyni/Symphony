const initialState = {
    artists: [],
    watchedArtist: null,
}

export function artistReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_ARTISTS':
            return {
                ...state,
                artists: action.artists
            }
        case 'SET_WATCHED_ARTIST':
            return {
                ...state,
                watchedArtist: action.artist
            }
        case 'REMOVE_ARTIST':
            return {
                ...state,
                artists: state.artists.filter(artist => artist._id !== action.artistId)
            }
        case 'ADD_ARTIST':
            return {
                ...state,
                artists: [...state.artists, action.artist]
            }
        case 'UPDATE_ARTIST':
            return {
                ...state,
                watchedArtist: action.updatedArtist
            }
        default:
            return state
    }
}
