export const StationDropdown = ({ isDropdown, setIsDropdown, isUserStation, isAdminMode, setIsEdit, onRemoveStation }) => {

    return (
        <ul className='dropdown-pl'>
            {(isUserStation || isAdminMode) &&
                <div>
                    <li onClick={() => {
                        setIsDropdown(!isDropdown)
                        setIsEdit(true)
                    }}>Edit</li>
                    <li onClick={() => onRemoveStation()}>Delete</li>
                </div>
            }
            <li onClick={() => console.log('should copy link to clipboard and also embed playlist')}>Share</li>
        </ul>

    )
}


