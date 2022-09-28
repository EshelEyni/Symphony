const dbService = require('../../services/db.service.js')
const logger = require('../../services/logger.service.js')
const ObjectId = require('mongodb').ObjectId


async function query() {
    console.log('QUERY');
    try {
        const collection = await dbService.getCollection('likedSong')
        let songs = await collection.find({}).toArray();
        return songs
    } catch (err) {
        console.log('Cannot get Data: ', err)
        throw err
    }
}

async function getById(songId) {
    try {
        const collection = await dbService.getCollection('likedSong')
        let song = await collection.findOne({ _id: ObjectId(songId) })
        song.createdAt = ObjectId(song._id).getTimestamp()
        return song
    }
    catch (err) {
        logger.error(`while finding song ${songId}`, err)
        throw err
    }
}

async function remove(songId) {
    try {
        const collection = await dbService.getCollection('likedSong')
        await collection.deleteOne({ _id: ObjectId(songId) })
        return songId
    } catch (err) {
        logger.error(`cannot remove station ${songId}`, err)
        throw err
    }
}

async function add(song) {
    const currSong = {
        desc: '',
        tags: [],
        img:song.img,
        "clip_id": song._id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        likedByUsers: song.likedByUsers || [],
    }
    try {
        const collection = await dbService.getCollection('likedSong')
        await collection.insertOne(currSong)
        return currSong
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function update(song) {
    try {
        var id = ObjectId(song._id)
        delete song._id
        const collection = await dbService.getCollection('likedSong')
        await collection.updateOne({ _id: id }, { $set: { ...song } })
        // console.log('song', song)
        return song
    } catch (err) {
        logger.error(`cannot update car ${song._id}`, err)
        throw err
    }
}


module.exports = {
    query,
    getById,
    remove,
    add,
    update
}