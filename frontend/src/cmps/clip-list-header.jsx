import React from 'react'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { stationReducer } from '../store/station.reducer'
import { useSelector } from 'react-redux'

export function ClipListHeader({ bgColor, station }) {
    const user = useSelector(state => state.userModule.user)
    const params = window.location.href

    return (
        <div
            style={{ backgroundColor: bgColor ? bgColor : '#121212' }}
            className='clip-header-container'>
            <div className='num-area'></div>
            <h1 className='title-area'># TITLE</h1>
            <h1 className='artist-area'>ARTIST</h1>
            <h1 className='date-area'>DATE ADDED</h1>
            <div className='like-area'></div>
            <h1 className='clock-area'><AccessTimeOutlinedIcon /></h1>
            <div className='burger-area'></div>
        </div>
    )
}