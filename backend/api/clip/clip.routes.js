const express = require('express')
const router = express.Router()
const { getClips } = require('./clip.controller')
router.get('/', getClips)
module.exports = router