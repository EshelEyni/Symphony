const initialState = {
    artists: [],
}

export function artistReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_ARTISTS':
            return {
                ...state,
                artists: action.artists
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
                artists: state.artists.map(artist => artist._id === action.updatedArtist._id ? action.updatedArtist : artist)
            }
        default:
            return state
    }
}
