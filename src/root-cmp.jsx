import React from 'react'
import { Routes, Route } from 'react-router-dom'
import routes from './routes'
import { AppHeader } from './cmps/app-header'
import { MediaPlayer } from './cmps/media-player'
import { SideBar } from './cmps/side-bar'

export function RootCmp() {

    return (
        <div className='main-container main-layout'>
            <AppHeader />
            <SideBar />
            <main className='main-content'>
                <Routes>
                    {routes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}
                </Routes>
            </main>
            <MediaPlayer />
        </div>
    )
}
