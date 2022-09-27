export const StationDropdown = ({ isDropdown, setIsDropdown, isUserStation,isAdmin, setIsEdit, onRemoveStation }) => {

    return (
        <ul className='dropdown-pl'>
            {(isUserStation || isAdmin) &&
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


