import { NavLink } from "react-router-dom"

export const LoginMsg = ({ currTop, setIsLoginMsg }) => {


    return <div
        style={{ top: currTop }}
        className='login-first-msg flex column space-between'>
        <div className='shadow-screen'
            onClick={() => setIsLoginMsg(false)}></div>
        <div className='login-first-msg-container'>
            <div className='tippy'></div>
            <p className='login-first-p-1'>
                Create a playlist
            </p>
            <p className='login-first-p-2'>
                Log in to create and share playlists.
            </p>
        </div>
        <div className='login-first-btns flex'>
            <button onClick={() => setIsLoginMsg(false)}>Not now</button>
            <NavLink to='/login'>
                <button onClick={() => setIsLoginMsg(false)}>Login</button>
            </NavLink>
        </div>
    </div>

}