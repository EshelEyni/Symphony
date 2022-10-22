const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getArtists, getArtistById, addArtist, updateArtist, removeArtist } = require('./artist.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getArtists)
router.get('/:artistId', getArtistById)
router.post('/', requireAuth, addArtist)
router.put('/:artistId', requireAuth, updateArtist)
router.delete('/:artistId', requireAuth, removeArtist)

module.exports = router