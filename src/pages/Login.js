import { NavLink as Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();
    const currentUser = useContext(AuthContext);
    const resetDialog = useRef();

    useEffect(() => {
        if (currentUser !== null) {
            navigate('/');
        }
    });

    async function handleSubmit(e) {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            e.target.querySelector('.error-msg').style.visibility = 'visible';
        }
    }

    async function resetPassword() {
        const resetemail = document.querySelector('#reset-email').value;
        try {
            await sendPasswordResetEmail(auth, resetemail);
            alert('!!Email sent!! Please check your email');
        } catch (err) {
            alert('Something went wrong!! Try again.');
        }
        resetDialog.current.close();
    }


    return (
        currentUser !== undefined &&
        <div className="login fade-in">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} >
                <label className="error-msg"> Invalid Username/Password</label>
                <input type="email" id="login-email" placeholder="Email" required />
                <input type="password" name="" id="login-password" placeholder="Password" required />
                <button type="submit">Sign-in</button>
            </form>
            <div>Don't have an account?
                <span>
                    <Link to='/register'> Register</Link>
                </span>
            </div>
            <div>Forgot your password?
                <span>
                    <button onClick={() => resetDialog.current.showModal()}>Reset Password</button>
                </span>
            </div>
            <dialog className="reset-dialog" ref={resetDialog}>
                <h2>Reset Password</h2>
                <button className="close" onClick={() => resetDialog.current.close()}>X</button>
                <div>
                    <input autoComplete='false' type="email" id="reset-email" placeholder='Enter Your Email' />
                    <button className="reset-password" onClick={resetPassword}>
                        Send email
                    </button>
                </div>
            </dialog >
        </div >
    )

}