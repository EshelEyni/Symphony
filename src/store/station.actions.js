import { query, remove, save } from '../services/station.service.js'

// Action Creators:
export function getActionRemoveStation(stationId) {
    return {
        type: 'REMOVE_MY_STATION',
        stationId
    }
}

export function getActionAddStation(station) {
    return {
        type: 'ADD_MY_STATION',
        station
    }
}

export function getActionUpdateStation(station) {
    return {
        type: 'UPDATE_MY_STATION',
        station
    }
}

export function loadStations(userId) {
    return async (dispatch) => {
        try {
            const stations = await query()
            dispatch({
                type: 'SET_MY_STATIONS',
                stations
            })
        }
        catch (err) {
            console.log('Cannot load stations', err)
        }
    }
}

export function removeStation(stationId) {
    return async (dispatch) => {
        try {
            await remove(stationId)
            dispatch(getActionRemoveStation(stationId))
            console.log('Deleted Succesfully!')
        } catch (err) {
            console.log('Cannot remove station', err)
        }
    }
}

export function addStation(station) {
    return async (dispatch) => {
        try {
           await dispatch(getActionAddStation(station))
            console.log('Added Station', station)
            return station
        } catch (err) {
            console.log('Cannot add station', err)
        }
    }
}

export function updateStation(stationToUpdate) {
    return async (dispatch) => {
        try {
            // const station = await save(stationToUpdate)
            // dispatch(getActionUpdateStation(station))
            dispatch(getActionUpdateStation(stationToUpdate))
        }
        catch (err) {
            console.log('Cannot save station', err)
        }
    }
}

