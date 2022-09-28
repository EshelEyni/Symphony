const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getSongs, getSongById, addSong, updateSong, removeSong } = require('./song.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.post('/', requireAuth, requireAdmin, addToy)
// router.put('/:toyId', requireAuth, requireAdmin, updateToy)
// router.delete('/:id', requireAuth, requireAdmin, removeStation)

router.get('/', getSongs)
router.get('/:songId', getSongById)
router.post('/', addSong)
// router.put('/:stationId', updateSong)
router.delete('/:stationId', removeSong)

module.exports = router