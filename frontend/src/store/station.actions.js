import { stationService } from '../services/station.service.js'


export function getActionUpdateStation(updatedStation) {
    return { type: 'UPDATE_STATION', updatedStation }
}

export function loadStations() {
    return async (dispatch) => {
        try {
            const stations = await stationService.query()
            dispatch({ type: 'SET_STATIONS', stations })
        }
        catch (err) {
            console.log('StationActions: Cannot load stations', err)
        }
    }
}

export function loadStation(stationId) {
    return async (dispatch) => {
        try {
            const station = stationId === 'clear-station' ? null : await stationService.getById(stationId)
            dispatch({ type: 'SET_CURR_STATION', station })
        }
        catch (err) {
            console.log('StationActions: Cannot set station', err)
        }
    }
}

export function updateStation(stationToUpdate) {
    return async (dispatch) => {
        try {
            const updatedStation = await stationService.save(stationToUpdate)
            dispatch(getActionUpdateStation(updatedStation))
        }
        catch (err) {
            console.log('StationActions: Cannot save station', err)
        }
    }
}

export function addStation(station) {
    return (dispatch) => {
        try {
            dispatch({ type: 'ADD_STATION', station })
        } catch (err) {
            console.log('StationActions: Cannot add station', err)
        }
    }
}

export function removeStation(stationId) {
    return async (dispatch) => {
        try {
            await stationService.remove(stationId)
            dispatch({ type: 'REMOVE_STATION', stationId })
        } catch (err) {
            console.log('StationActions: Cannot remove station', err)
        }
    }
}


export function setTags(tags) {
    return async (dispatch) => {
        try {
            dispatch({
                type: 'SET_TAGS',
                tags
            })
        }
        catch (err) {
            console.log('StationActions: Cannot set station', err)
        }
    }
}

export function setGetStationsByTag(stations) {
    return (dispatch) => {
        try {
            const serviceFunc = stationService.getStationByTag(stations)
            dispatch({
                type: 'SET_GET_STATION_BY_TAG_FUNC',
                serviceFunc
            })
        }
        catch (err) {
            console.log('StationActions: Cannot set get station by tag', err)
        }
    }
}
