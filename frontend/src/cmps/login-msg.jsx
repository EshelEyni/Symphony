import { useNavigate } from 'react-router-dom'

export const LoginMsg = ({ loginMsgProperties, setIsLoginMsg }) => {
    const navigate = useNavigate()

    return <section
        style={{ top: loginMsgProperties.top }}
        className='login-first-msg flex column'>
        <div className='shadow-screen'
            onClick={() => setIsLoginMsg(false)}></div>
        <section className='login-first-msg-container'>
            <span className='tippy'></span>
            <p className='login-first-p-1'>
               {loginMsgProperties.title}
            </p>
            <p className='login-first-p-2'>
               {loginMsgProperties.txt}
            </p>
        </section>
        <section className='login-first-btns flex'>
            <button onClick={() => setIsLoginMsg(false)}>Not now</button>
            <button onClick={() => {
                setIsLoginMsg(false)
                navigate('/login')
            }}>Log in</button>
        </section>
    </section>
}