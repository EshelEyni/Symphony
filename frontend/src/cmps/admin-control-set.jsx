import { useDispatch } from "react-redux"
import { updateStation } from "../store/station.actions"
import { addDesc, addTag, setArtistStation } from "../services/admin-service"

export const AdminControlSet = ({
    currStation
}) => {
    const dispatch = useDispatch()

    const onAdminSaveStation = (station) => {
        if (station.tags.length === 0) return alert('Please enter tags to station...')
        if (!station.desc) return alert('Please enter a description to station...')
        station.createdBy = {
            _id: 'a101',
            username: 'Symphony',
            fullname: 'Symphony'
        }

        dispatch(updateStation(station))
    }

    const onSetArtistStation = (station) => {
        const updatedStation = setArtistStation(station)
        dispatch(updateStation({ ...updatedStation }))
    }

    const onAddTag = (station) => {
        addTag(station)
    }

    const onAddDesc = (station) => {
        addDesc(station)
    }

    return (
        <section className='admin-control-set'>
            <button onClick={() => onAdminSaveStation(currStation)}>Save With Admin Mode</button>
            <button onClick={() => onAddTag(currStation)}>Add Tag</button>
            <button onClick={() => onAddDesc(currStation)}>Add Desc</button>
            <button onClick={() => onSetArtistStation(currStation)}>Set Artist Mode</button>
        </section>
    )
}