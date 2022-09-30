import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { StationList } from '../cmps/station-list.jsx'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { stationService } from '../services/station.service.js'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { loadStations } from '../store/station.actions.js'

export const SymphonyApp = () => {
    let stations = useSelector(state => state.stationModule.stations)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        if (!stations.length) dispatch(loadStations())
    }, [stations])

    return (
        <div>
            <h1>Rock</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Rock'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Rock')} />
            </div>

            <h1>Hip Hop</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Hip Hop'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Hip Hop')} />
            </div>

            <h1>Soothing</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Soothing'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Soothing')} />
            </div>

            <h1>Pop</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Pop'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Pop')} />
            </div>

            <h1>60s</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/60s'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, '60s')} />
            </div>

            <h1>Funk</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Funk'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Funk')} />
            </div>

            <h1>Love</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Love'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Love')} />
            </div>

            <h1>Dance</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Dance'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Dance')} />
            </div>

            <h1>Israeli</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Israeli'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Israeli')} />
            </div>

            <h1>Top songs</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Top songs'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Top songs')} />
            </div>

            <h1>Europe</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Europe'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Europe')} />
            </div>

            <h1>Metal</h1>
            <div className="station-by-tag-container">
                <Link to={'/tag/Metal'}>SEE ALL</Link>
                <StationList stations={stationService.getStationByTag(stations, 'Metal')} />
            </div>
        </div >
    )
}

