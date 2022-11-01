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
            <section className='confirm-delete-profile-btns grid'>
                <div className='flex justify-center align-center'>
                    <button onClick={() => setIsDeleteClicked(false)}>{isProfileDropDown ? 'Not now' : 'CANCEL'}</button>
                </div>
                <div className='flex justify-center align-center'>
                    {isProfileDropDown && <button onClick={onRemoveUser}>Delete Account</button>}
                    {isStationDropdown && <button onClick={onRemoveStation}>DELETE</button>}
                </div>
            </section>
        </section>
    )
}