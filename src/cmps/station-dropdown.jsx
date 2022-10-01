export const StationDropdown = ({
    isDropdown,
    isSearchStation,
    setIsDropdown,
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
            <li onClick={() => console.log('should copy link to clipboard and also embed playlist')}>Share</li>
        </ul>

    )
}


