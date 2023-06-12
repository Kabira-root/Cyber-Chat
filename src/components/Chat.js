import { useContext, useEffect, useState } from "react";
import Message from "./Message";
import sendIcon from '../images/send-icon.svg';
import { doc, arrayUnion, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const currentUser = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  // const monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    data.chatId && fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.chatId]);

  async function fetchMessages() {
    try {
      const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        const msg = doc.data().messages;
        setMessages(msg);
      }
      );

      return () => {
        unsub();
      };
    } catch (err) {
      console.error(err);
    }
  }

  const sendMessage = async () => {
    const messageInput = document.getElementById('message-input');
    if (messageInput.value) {
      let date = new Date();
      const month = monthsShort[date.getMonth() - 1];
      const hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
      const minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
      const dateTime = `${date.getDate()} ${month}, ${hours}:${minutes}`;
      const msg = {
        "message": messageInput.value,
        "date": dateTime,
        "sender": currentUser.uid,
      };

      const docRef = doc(db, "chats", data.chatId);
      updateDoc(docRef, "messages", arrayUnion(msg));
    }
    setMessage('');
  };

  return (
    <div className="chat">

      <div className="user-info">
        {data.user.uid &&
          <>
            <img className="user-icon" src={data.user.photoURL} alt="" />
            <span className="username">{data.user.displayName}</span>
            <button onClick={() => dispatch({ type: "CLEAR_USER", user: {} })} >
              <svg viewBox="0 0 400 400" >
                <circle cx="200" cy="200" r="175" />
                <g>
                  <line x1="110" y1="200" x2="290" y2="200" fill="none" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M190 110 L100 200 L190 290 " fill="none" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </button>
          </>
        }
      </div>

      {
        !data.chatId
          ? <div className="no-chat">No chat opened</div>
          : <>
            <div className='messages'>
              {messages.map((message, index) => {
                return <Message key={index} msg={message} />
              }
              )}

            </div>
            {/* input field for sending messages */}
            <div className="message-input">
              <input id='message-input' value={message} onChange={e => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} type="text" placeholder="Enter your message..." />
              <button onClick={() => sendMessage()}  ><img src={sendIcon} alt="" /></button>
            </div>
          </>
      }

    </div >
  )
}