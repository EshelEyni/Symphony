const artistService = require('./artist.service.js')
const logger = require('../../services/logger.service.js')

// GET LIST
async function getArtists(req, res) {

    try {
        logger.debug('Getting Artists')
        const artists = await artistService.query()
        res.send(artists)
    } catch (err) {
        logger.error('Failed to get artists', err)
        res.status(500).send({ err: 'Failed to get artists' })
    }
}



// READ
async function getArtistById(req, res) {
    try {
        const { artistId } = req.params
        const artist = await artistService.getById(artistId)
        res.send(artist)
    } catch (err) {
        logger.error('Failed to get artist', err)
        res.status(500).send({ err: 'Failed to get artist' })
    }
}

// CREATE
async function addArtist(req, res) {
    try {
        const currArtist = req.body
        const artist = await artistService.add(currArtist)
        res.send(artist)
    }
    catch (err) {
        logger.error('Failed to add artist', err)
        res.status(500).send({ err: 'Failed to add artist' })
    }
}

// UPDATE
async function updateArtist(req, res) {
    try {
        const artistToUpdate = req.body
        const updatedArtist = await artistService.update(artistToUpdate)
        res.send(updatedArtist)
    } catch (err) {
        logger.error('Failed to update artist', err)
        res.status(500).send({ err: 'Failed to update artist' })
    }
}

// DELETE
async function removeArtist(req, res) {
    const artistId = req.params.artistId
    try {
        await artistService.remove(artistId)
        res.send({ msg: 'Removed succesfully' })
    }
    catch (err) {
        logger.error('Failed to remove artist', err)
        res.status(500).send({ err: 'Failed to remove artist' })
    }
}



module.exports = {
    getArtists,
    getArtistById,
    addArtist,
    updateArtist,
    removeArtist,
}