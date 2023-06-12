import { collection, query, where, getDocs } from "firebase/firestore";
import { useContext, useState } from "react";
import { db } from "../firebase";
import User from "./User";
import { AuthContext } from "../context/AuthContext";

export const Search = () => {

    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const currentUser = useContext(AuthContext);

    const handleSearch = async () => {
        // Create a query against the collection.
        const q = query(collection(db, 'users'), where("displayName", "==", username), where("displayName", "!=", currentUser.displayName));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
            if (querySnapshot.empty) setErr(true); //if snapshot is empty i.e. no documents
            else setErr(false);
            setUsername('');
        } catch (error) {
            console.error(err, error);
            setErr(true);
        }

    }

    const handleKey = (e) => {
        e.keyCode === 13 && handleSearch();
    }

    const handleClick = () => {
        setUsername('');
        setUser(null);
    };


    return (
        <div className="search">
            <div className="search-form">
                <input type="text" value={username} id="search-input" placeholder="Find a user" onKeyDown={handleKey} onSubmit={handleKey} onChange={e => setUsername(e.target.value)} />
                <button className="cancel-search" onClick={() => { setErr(false); setUser(null); setUsername(''); }} >X</button>
            </div>
            {err && <span>User not found!</span>}
            {
                user && <div onClick={handleClick}> <User user={user} /></div>
            }
        </div >
    )
}