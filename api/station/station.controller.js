const stationService = require('./station.service.js')
const logger = require('../../services/logger.service.js')

// GET LIST
async function getStations(req, res) {

    try {
        logger.debug('Getting Stations')
        const stations = await stationService.query()
        res.send(stations)
    } catch (err) {
        logger.error('Failed to get stations', err)
        res.status(500).send({ err: 'Failed to get stations' })
    }
}



// READ
async function getStationById(req, res) {
    try {
        const { stationId } = req.params
        const station = await stationService.getById(stationId)
        res.send(station)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

// CREATE
async function addStation(req, res) {
    try {
        const currStation = req.body
        const station = await stationService.add(currStation)
        res.send(station)
    }
    catch (err) {
        logger.error('Failed to add station', err)
        res.status(500).send({ err: 'Failed to add station' })
    }
}

// UPDATE
async function updateStation(req, res) {
    try {
        const stationToUpdate = req.body
        const updatedStation = await stationService.update(stationToUpdate)
        res.send(updatedStation)
    } catch (err) {
        logger.error('Failed to update station', err)
        res.status(500).send({ err: 'Failed to update station' })
    }
}

// DELETE
async function removeStation(req, res) {
    const stationId = req.params.stationId
    console.log('req.params', req.params)
    console.log('stationId', stationId)
    try {
        await stationService.remove(stationId)
        res.send({ msg: 'Removed succesfully' })
    }
    catch (err) {
        logger.error('Failed to remove station', err)
        res.status(500).send({ err: 'Failed to remove station' })
    }
}



module.exports = {
    getStations,
    getStationById,
    addStation,
    updateStation,
    removeStation,
}