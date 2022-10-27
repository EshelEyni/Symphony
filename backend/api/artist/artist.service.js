const dbService = require('../../services/db.service.js')
const logger = require('../../services/logger.service.js')
const ObjectId = require('mongodb').ObjectId


async function query() {
    try {
        const collection = await dbService.getCollection('artist')
        let stations = await collection.find({}).toArray();
        return stations
    } catch (err) {
        console.log('Cannot get Data: ', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('artist')
        const station = await collection.findOne({ _id: ObjectId(stationId) })
        station.createdAt = ObjectId(station._id).getTimestamp()
        return station
    }
    catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
        const collection = await dbService.getCollection('artist')
        await collection.deleteOne({ _id: ObjectId(stationId) })
        return stationId
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}

async function add(station) {
    const currStation = {
        ...station,
        imgUrl: station.imgUrl || 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png',
        desc: '',
        tags: [],
        clips: station.clips || [],
        isPublic: false,
        bgColor: '#03435C'

    }
    try {
        const collection = await dbService.getCollection('artist')
        await collection.insertOne(currStation)
        return currStation
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function update(artistToUpdate) {
    try {
        var id = ObjectId(artistToUpdate._id)
        delete artistToUpdate._id
        const collection = await dbService.getCollection('artist')
        await collection.updateOne({ _id: id }, { $set: { ...artistToUpdate } })
        
        return { _id: id, ...artistToUpdate }
    } catch (err) {
        logger.error(`cannot update artist ${artistToUpdate._id}`, err)
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