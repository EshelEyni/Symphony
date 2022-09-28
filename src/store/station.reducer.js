const initialState = {
    stations: [],
}
export function stationReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_MY_STATIONS':
            return {
                ...state,
                stations: action.stations
            }
        case 'REMOVE_MY_STATION':
            return {
                ...state,
                stations: state.stations.filter(station => station._id !== action.stationId)
            }
        case 'ADD_MY_STATION':
            return {
                ...state,
                stations: [...state.stations, action.station]
            }
        case 'UPDATE_MY_STATION':
            return {
                ...state,
                stations: state.stations.map(station => station._id === action.station._id ? action.station : station)
            }
        default:
            return state
    }
}
