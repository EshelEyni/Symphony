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
            className='header-container flex'>
            <h1 className='title'># TITLE</h1>
            <h1 className='album'>ARTIST</h1>
            <h1 className='date'>{((params.includes('liked')) || station?.createdBy?._id === user?._id) && 'DATE ADDED'}</h1>
            <h1 className='clock'><AccessTimeOutlinedIcon /></h1>
        </div>
    )
}