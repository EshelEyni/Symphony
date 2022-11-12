export const ConfirmDeleteMsg = ({
    setIsDeleteClicked,
    isProfileDropDown,
    isStationDropdown,
    onRemoveUser,
    onRemoveStation
}) => {

    return (
        <div className="confirm-delete-msg-container">
            <section className='confirm-delete-msg'>
                <p>Are you sure...?</p>
                <section className='btns grid'>
                    <div className='flex justify-center align-center'>
                        <button onClick={() => setIsDeleteClicked(false)}>{isProfileDropDown ? 'Not now' : 'CANCEL'}</button>
                    </div>
                    <div className='flex justify-center align-center'>
                        {isProfileDropDown && <button onClick={onRemoveUser}>Delete Account</button>}
                        {isStationDropdown && <button onClick={onRemoveStation}>DELETE</button>}
                    </div>
                </section>
            </section>
        </div>
    )
}