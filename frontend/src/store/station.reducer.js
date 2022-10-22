const initialState = {
    stations: [],
    tags: [],
    currStation: null,
    getStationByTag: null
}
export function stationReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_STATIONS':
            return {
                ...state,
                stations: action.stations
            }
        case 'SET_CURR_STATION':
            return {
                ...state,
                currStation: action.station
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
                currStation: action.updatedStation
            }
        case 'SET_TAGS':
            return {
                ...state,
                tags: action.tags
            }
        case 'SET_GET_STATION_BY_TAG_FUNC':
            return {
                ...state,
                getStationByTag: action.serviceFunc
            }
        default:
            return state
    }
}
