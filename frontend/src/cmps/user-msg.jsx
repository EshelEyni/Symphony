import { useSelector } from 'react-redux'

export const UserMsg = () => {
    const { userMsg } = useSelector(state => state.userModule)

        return (
            <section
                className='user-msg flex space-around align-center'>
                {userMsg}
            </section>
        )
    }