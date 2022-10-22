const dbService = require('../../services/db.service.js')
const logger = require('../../services/logger.service.js')
const ObjectId = require('mongodb').ObjectId


async function query() {
    console.log('QUERY');
    try {
        const collection = await dbService.getCollection('station')
        let stations = await collection.find({}).toArray();
        return stations
    } catch (err) {
        console.log('Cannot get Data: ', err)
        throw err
    }
}

async function getById(stationId) {
    console.log('stationId', stationId)
    try {
        const collection = await dbService.getCollection('station')
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
        const collection = await dbService.getCollection('station')
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
        likedByUsers: [],
        clips: station.clips || [],
    }
    console.log('station', station)
    console.log('currStation', currStation)
    try {
        const collection = await dbService.getCollection('station')
        await collection.insertOne(currStation)
        return currStation
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function update(stationToUpdate) {
    try {
        var id = ObjectId(stationToUpdate._id)
        delete stationToUpdate._id
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: id }, { $set: { ...stationToUpdate } })
        console.log('stationToUpdate', stationToUpdate._id)
        
        return { _id: id, ...stationToUpdate }
    } catch (err) {
        logger.error(`cannot update car ${stationToUpdate._id}`, err)
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