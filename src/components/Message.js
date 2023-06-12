import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Message({ msg }) {
    const { sender, message, date } = msg;
    const currentUser = useContext(AuthContext);
    return (
        <div className={sender === currentUser.uid ? 'msg msg-send fade-in' : 'msg msg-receive fade-in'} >
            <p>
                {message}<span> {date}</span>
            </p>
        </div >
    )
}