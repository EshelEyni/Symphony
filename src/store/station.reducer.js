const initialState = {
    stations: [],
}
export function stationReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_STATIONS':
            return {
                ...state,
                stations: action.stations
            }
        case 'REMOVE_STATION':
            return {
                ...state,
                stations: state.stations.filter(station => station._id !== action.stationId)
            }
        case 'ADD_STATION':
            return {
                ...state,
                stations: [...state.stations, action.station]
            }
        case 'UPDATE_STATION':
            return {
                ...state,
                stations: state.stations.map(station => station._id === action.station._id ? action.station : station)
            }
        default:
            return state
    }
}
