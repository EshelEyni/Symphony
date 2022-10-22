const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStations, getStationById, addStation, updateStation, removeStation } = require('./station.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.post('/', requireAuth, requireAdmin, addToy)
// router.put('/:toyId', requireAuth, requireAdmin, updateToy)
// router.delete('/:id', requireAuth, requireAdmin, removeStation)

router.get('/', getStations)
router.get('/:stationId', getStationById)
router.post('/', addStation)
router.put('/:stationId', updateStation)
router.delete('/:stationId', removeStation)

module.exports = router