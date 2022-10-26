import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import routes from './routes'
import { AppHeader } from './cmps/app-header'
import { MediaPlayer } from './cmps/media-player'
import { SideBar } from './cmps/side-bar'
import { UserMsg } from './cmps/user-msg'
import { useSelector } from 'react-redux'

export function RootCmp() {
    const { userMsg } = useSelector(state => state.userModule)
    const [isUserMsgShown, setIsUserMsgShown] = useState()

    useEffect(() => {
        setIsUserMsgShown(userMsg)
    }, [userMsg])

    return (
        <section className='main-container main-layout'>
            <AppHeader />
            <SideBar />
            <main className='main-content'>
                <Routes>
                    {routes.map(route => <Route key={route.path} element={route.component} exact={true} path={route.path} />)}
                </Routes>
            </main>
            {isUserMsgShown && <UserMsg />}
            <MediaPlayer />
        </section>
    )
}
