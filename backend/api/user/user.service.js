
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query() {
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find().toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        var id = ObjectId(user._id)
        delete user._id
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: id }, { $set: { ...user } })
        return { _id: id, ...user }
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            isAdmin: false,
            imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1665703006/blank-user_nmdesg.png',
            prevClip: null,
            prevList: [],
            createdStations: [],
            publicStations:[],
            recentSearches: [],
            recentlyPlayed: {
                name: "recently Played",
                imgUrl: '',
                clips: [],
                createdBy: {
                    username: user.username
                }
            },
            likedStations: [],
            likedSongs: {
                name: "Liked Songs",
                imgUrl: '../assets/img/likedsongs.png',
                clips: [],
                createdBy: {
                    username: user.username
                }
            },
            followers: [],
            following: [],
            bgColor: '#646462'
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}