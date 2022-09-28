const songService = require('./song.service.js')
const logger = require('../../services/logger.service.js')

// GET LIST
async function getSongs(req, res) {

    try {
        logger.debug('Getting Stations')
        const songs = await songService.query()
        res.send(songs)
    } catch (err) {
        logger.error('Failed to get liked songs', err)
        res.status(500).send({ err: 'Failed to get liked songs' })
    }
}

// READ
async function getSongById(req, res) {
    try {
        const { songId } = req.params
        const song = await songService.getById(songId)
        res.send(song)
    } catch (err) {
        logger.error('Failed to get song', err)
        res.status(500).send({ err: 'Failed to get song' })
    }
}

// CREATE
async function addSong(req, res) {
    try {
        const currSong = req.body
        const song = await songService.add(currSong)
        res.send(song)
    }
    catch (err) {
        logger.error('Failed to add song', err)
        res.status(500).send({ err: 'Failed to add song' })
    }
}

// UPDATE
async function updateSong(req, res) {
    const currSong = req.body
    try {
        const song = await songService.update(currSong)
        res.send(song)
    } catch (err) {
        logger.error('Failed to update song', err)
        res.status(500).send({ err: 'Failed to update song' })
    }
}

// DELETE
async function removeSong(req, res) {
    const songId = req.params.songId
    console.log('req.params', req.params)
    console.log('songId', songId)
    try {
        await songService.remove(songId)
        res.send({ msg: 'Removed succesfully' })
    }
    catch (err) {
        logger.error('Failed to remove song', err)
        res.status(500).send({ err: 'Failed to remove song' })
    }
}

module.exports = {
    getSongs,
    getSongById,
    addSong,
    updateSong,
    removeSong,
}