import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export default function User({ user }) {
    const currentUser = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleClick = async (e) => {
        //get active userchat and toggle active class. then add active clas to current opened user chat active
        const active = document.querySelector('.contact-card.active');
        active && active.classList.remove('active');
        e.target.classList.add('active');

        //check if chat(chats collection in firestore) exists or not
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "chats", combinedId));
            if (!res.exists()) {
                //create chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                //create user chats for currentUser(logged in user)
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userinfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                //create userchats for the other user as well
                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userinfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
            // dispatch action to chatcontext to change the chatid
            dispatch({ type: "CHANGE_USER", payload: user });
        } catch (err) { console.error(err) }

    }

    return (
        <div className='contact-card fade-in' onClick={handleClick}>
            <img src={user.photoURL} alt="User Icon" />
            <div>{user.displayName}</div>
        </div>
    )
}