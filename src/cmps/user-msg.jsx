import { useSelector } from 'react-redux'

export const UserMsg = () => {
    const userMsg = useSelector(state => state.userModule.userMsg)
    return <div
        className={'user-msg flex space-around align-center user-msg '
            + (userMsg?.class || 'hidden')}>{userMsg?.msg}</div>
}