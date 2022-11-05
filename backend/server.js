const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')


const app = express()
const http = require('http').createServer(app)


// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

// cors
if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080','http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}


// Express Routing://
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

const artistRoutes = require('./api/artist/artist.routes')
const stationRoutes = require('./api/station/station.routes')
const userRoutes = require('./api/user/user.routes')
const authRoutes = require('./api/auth/auth.routes')
const {setupSocketAPI} = require('./services/socket.service')

app.use('/api/artist', artistRoutes)
app.use('/api/station', stationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
setupSocketAPI(http)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})