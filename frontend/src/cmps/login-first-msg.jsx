import { useNavigate } from 'react-router-dom'

export const LoginFirstMsg = ({
    loginMsgProperties,
    setIsLoginMsg
}) => {
    
    const navigate = useNavigate()

    return <section
        className='login-first-msg flex column'>
        <span className='tippy'></span>
        <div className='login-first-txt-container'>
            <p className='login-first-msg-title'>
                {loginMsgProperties.title}
            </p>
            <p className='login-first-msg-txt'>
                {loginMsgProperties.txt}
            </p>
        </div>
        <section className='login-first-btns grid'>
            <div className='flex justify-center align-center'>
                <button onClick={() => setIsLoginMsg(false)}>Not now</button>
            </div>
            <div className='flex justify-center align-center'>
                <button onClick={() => {
                    setIsLoginMsg(false)
                    navigate('/login')
                }}>Log in</button>
            </div>
        </section>
    </section >
}