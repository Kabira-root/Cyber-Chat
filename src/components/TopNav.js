import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TopNav() {

    const navigate = useNavigate();
    const currentUser = useContext(AuthContext);

    return (
        <div className="nav">
            <span className="app-icon">I/O Chat</span>
            <div className="user-info">
                <img className="user-icon" src={currentUser.photoURL} alt="" />
                <span className="username">{currentUser.displayName}</span>
            </div>
            <button className='btn-logout' onClick={async () => {
                try {
                    await signOut(auth);
                    navigate('/login');
                } catch (error) {
                    console.error(error.code, "::", error.message);
                }
            }}>Logout</button>
        </div>
    )
}