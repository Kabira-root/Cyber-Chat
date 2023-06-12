import { useContext, useEffect, useRef, useState } from "react";
import TopNav from "./TopNav";
import User from "./User";
import { Search } from "./Search";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export default function SideBar() {

    const [users, setUsers] = useState([]);
    const sidebarContainer = useRef();
    const currentUser = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const fetchUsers = () => {
            try {
                const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                    if (doc.data()) {
                        const data = Object.entries(doc.data()); //array of user chats
                        let userdata = [];
                        data.forEach((element) => {
                            userdata.push(element[1]);
                        });
                        setUsers(userdata);
                    }
                });
                return () => {
                    unsub();
                };
            } catch (err) {
                console.error(err);
            }
        }
        data.chatId
            ? sidebarContainer.current.classList.add('collapsed')
            : sidebarContainer.current.classList.remove('collapsed');
        currentUser.uid && fetchUsers();
    }, [currentUser.uid, data.chatId]);

    return (
        <div ref={sidebarContainer} className="fade-in sidebar">
            <TopNav />
            <Search />
            {
                users.map((user) => {
                    return < User key={user.userinfo.uid} user={user.userinfo} />
                })
            }
        </div>
    )
}