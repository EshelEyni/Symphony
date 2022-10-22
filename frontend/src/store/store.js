import { legacy_createStore as createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'

import { stationReducer } from './station.reducer.js'
import { artistReducer } from './artist.reducer.js'
import { userReducer } from './user.reducer.js'
import { MediaPlayerReducer } from './media-player.reducer.js'
import { appHeaderReducer } from './app-header.reducer.js'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
    stationModule: stationReducer,
    artistModule: artistReducer,
    userModule: userReducer,
    mediaPlayerModule: MediaPlayerReducer,
    appHeaderModule: appHeaderReducer
})


export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
window.gStore = store