const userService = require('./user.service')
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')
const authService = require('../auth/auth.service')

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function addUser(req, res) {
    const currUser = req.body
    const user = await userService.add(currUser)
    res.send(user)
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const userToUpdate = req.body
        const updatedUser = await userService.update(userToUpdate)
        socketService.broadcast({ type: 'user-updated', data: updatedUser, userId: updatedUser._id })
        res.send(updatedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    getUsers,
    addUser,
    deleteUser,
    updateUser
}