import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { StationList } from '../cmps/station-list.jsx'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { getStationByTag } from '../services/station.service.js'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { loadStations } from '../store/station.actions.js'

export const SymphonyApp = () => {
    let stations = useSelector(state => state.stationModule.stations)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        dispatch(loadStations())
    }, [])

    return (
        <div>
            <div className="station-by-tag-container">
                <div className='tag-link'>
                    <h1>Rock</h1>
                    <Link to={'/tag/Rock'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Rock')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>
                    <h1>Hip Hop</h1>
                    <Link to={'/tag/Hip Hop'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Hip Hop')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>
                    <h1>Soothing</h1>
                    <Link to={'/tag/Soothing'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Soothing')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>
                    <h1>Pop</h1>
                    <Link to={'/tag/Pop'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Pop')} />
            </div>


            <div className="station-by-tag-container">
                <div className='tag-link'>
                    <h1>60s</h1>
                    <Link to={'/tag/60s'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, '60s')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>

                    <h1>Funk</h1>
                    <Link to={'/tag/Funk'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Funk')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>

                    <h1>Love</h1>
                    <Link to={'/tag/Love'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Love')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>

                    <h1>Dance</h1>
                    <Link to={'/tag/Dance'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Dance')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>

                    <h1>Israeli</h1>
                    <Link to={'/tag/Israeli'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Israeli')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>

                    <h1>Top songs</h1>
                    <Link to={'/tag/Top songs'}>SEE ALL</Link>
                </div>
                <StationList stations={getStationByTag(stations, 'Top songs')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>

                    <h1>Europe</h1>
                </div>
                <Link to={'/tag/Europe'}>SEE ALL</Link>
                <StationList stations={getStationByTag(stations, 'Europe')} />
            </div>

            <div className="station-by-tag-container">
                <div className='tag-link'>

                    <h1>Metal</h1>
                </div>
                <Link to={'/tag/Metal'}>SEE ALL</Link>
                <StationList stations={getStationByTag(stations, 'Metal')} />
            </div>
        </div >
    )
}

