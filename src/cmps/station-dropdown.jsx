export const StationDropdown = ({
    isDropdown,
    isSearchStation,
    setIsDropdown,
    stationId,
    isUserStation,
    isAdminMode,
    setIsEdit,
    onSaveSearchStation,
    onRemoveStation }) => {


    return (
        <ul className='station-dropdown'>
            {(isUserStation || isAdminMode) &&
                <div>
                    <li onClick={() => {
                        setIsDropdown(!isDropdown)
                        setIsEdit(true)
                    }}>Edit</li>
                    <li onClick={() => onRemoveStation()}>Delete</li>
                    {isSearchStation &&
                        <li onClick={() => onSaveSearchStation()}>Save Playlist</li>}
                </div>
            }
            <li onClick={() => navigator.clipboard.writeText('http://localhost:3000/#/station/' + stationId)}>Share</li>
        </ul>

    )
}


