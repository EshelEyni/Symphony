import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { StationList } from '../cmps/station-list.jsx'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { getStationByTag } from '../services/station.service.js'
import { setHeaderBgcolor } from '../store/app-header.actions.js'

export const SymphonyApp = () => {
    let stations = useSelector(state => state.stationModule.stations)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
    }, [])

    return (
        <div>
            <h1>Rock</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Rock')} />
            </div>

            <h1>Hip Hop</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Hip Hop')} />
            </div>

            <h1>Soothing</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Soothing')} />
            </div>

            <h1>Pop</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Pop')} />
            </div>

            <h1>60s</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, '60s')} />
            </div>

            <h1>Funk</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Funk')} />
            </div>

            <h1>Love</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Love')} />
            </div>

            <h1>Dance</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Dance')} />
            </div>

            <h1>Israeli</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Israeli')} />
            </div>

            <h1>Top songs</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Top songs')} />
            </div>

            <h1>Europe</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Europe')} />
            </div>

            <h1>Metal</h1>
            <div className="station-list-rock">
                <StationList stations={getStationByTag(stations, 'Metal')} />
            </div>
        </div >
    )
}

