import { useSelector } from 'react-redux'
import { ConfirmDeleteMsg } from './confirm-delete-msg'

export const UserMsg = ({
    isDeleteMsg,
    setIsDeleteClicked,
    isProfileDropDown,
    onRemoveUser,
    isUserStation,
    onRemoveStation
}) => {

    const { userMsg } = useSelector(state => state.userModule)

    if (userMsg) {
        return (
            <section
                className='user-msg flex space-around align-center'>
                {userMsg}
            </section>
        )
    }

    if (isDeleteMsg) {
        return (
            <ConfirmDeleteMsg
                setIsDeleteClicked={setIsDeleteClicked}
                isProfileDropDown={isProfileDropDown}
                isUserStation={isUserStation}
                onRemoveUser={onRemoveUser}
                onRemoveStation={onRemoveStation}
            />
        )
    }
}