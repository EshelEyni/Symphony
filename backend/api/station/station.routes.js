const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStations, getStationById, addStation, updateStation, removeStation } = require('./station.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStations)
router.get('/:stationId', log, getStationById)
router.post('/', log, requireAuth, addStation)
router.put('/:stationId', log, requireAuth, updateStation)
router.delete('/:stationId', log, requireAuth, removeStation)

module.exports = router