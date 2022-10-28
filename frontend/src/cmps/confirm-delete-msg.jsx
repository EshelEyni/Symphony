export const ConfirmDeleteMsg = ({
    setIsDeleteClicked,
    isProfileDropDown,
    isStationDropdown,
    onRemoveUser,
    onRemoveStation
}) => {

    return (
        <section className='confirm-delete-profile-msg'>
            <p>Are you sure...?</p>
            <section className='confirm-delete-profile-btns flex'>
                <button onClick={() => setIsDeleteClicked(false)}>{isProfileDropDown ? 'Not now' : 'CANCEL'}</button>
                {isProfileDropDown && <button onClick={onRemoveUser}>Delete account</button>}
                {isStationDropdown && <button onClick={onRemoveStation}>DELETE</button>}
            </section>
        </section>
    )
}