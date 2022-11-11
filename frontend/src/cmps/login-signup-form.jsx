import { Link } from "react-router-dom"

export const LoginSignupForm = ({
    onHandleSubmit,
    handleChange,
    isError,
    errorTxt,
    link,
    isSignup
}) => {


    return (
        <form
            onSubmit={onHandleSubmit}
            className='login-signup-form flex column'>
            <input
                className='login-signup-input'
                type='txt'
                name='username'
                placeholder='Username*'
                onChange={handleChange}
                onSubmit={onHandleSubmit}
                required
            />
            {isSignup && <input
                className='login-signup-input'
                type='txt'
                name='fullname'
                placeholder='Fullname*'
                onChange={handleChange}
                onSubmit={onHandleSubmit}
                required
            />}
            <input
                className='login-signup-input'
                type='password'
                name='password'
                placeholder='Password*'
                onChange={handleChange}
                onSubmit={onHandleSubmit}
                required
            />
            {isError && <p className='error-msg'>{errorTxt}</p>}
            <div className='form-btn-container'>
                <button
                    onClick={onHandleSubmit}
                    className='login-signup-btn'
                >
                    {isSignup ? 'Signup' : 'Login'}
                </button>
                <Link to={link.path}>{link.txt}</Link>
            </div>
        </form>
    )
}