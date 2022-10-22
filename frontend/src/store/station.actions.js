import { stationService } from '../services/station.service.js'

export function loadStations() {
    return async (dispatch) => {
        try {
            const stations = await stationService.query()
            dispatch({
                type: 'SET_STATIONS',
                stations
            })
        }
        catch (err) {
            console.log('StationActions: Cannot load stations', err)
        }
    }
}

export function removeStation(stationId) {
    return async (dispatch) => {
        try {
            await stationService.remove(stationId)
            dispatch({
                type: 'REMOVE_STATION',
                stationId
            })
            console.log('Deleted Succesfully!')
        } catch (err) {
            console.log('StationActions: Cannot remove station', err)
        }
    }
}

export function addStation(station) {
    return async (dispatch) => {
        try {
            await dispatch({
                type: 'ADD_STATION',
                station
            })
            console.log('Added Station', station)
            return station
        } catch (err) {
            console.log('StationActions: Cannot add station', err)
        }
    }
}

export function updateStation(stationToUpdate) {
    return async (dispatch) => {
        try {
            const updatedStation = await stationService.save(stationToUpdate)
            console.log('updatedStation', updatedStation)
            dispatch({
                type: 'UPDATE_STATION',
                updatedStation
            })
        }
        catch (err) {
            console.log('StationActions: Cannot save station', err)
        }
    }
}

