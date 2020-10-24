import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Chat.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from "@material-ui/icons/Send";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { useStatevalue } from "./StateProvider";
import firebase from 'firebase';
function Chat() {
  const [input, setinput] = useState("");
  const { roomid } = useParams();
  const [roomName, setroomName] = useState("");
  const [messages, setmessages] = useState([]);
  const [{user},]=useStatevalue()
  useEffect(() => {
    if (roomid) {
      db.collection("rooms")
        .doc(roomid)
        .onSnapshot((snapshot) => setroomName(snapshot.data().name));
      db.collection("rooms")
        .doc(roomid)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setmessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomid]);
  const sendMessage = (e) => {
    e.preventDefault();
    const checkEmpty = input.replaceAll(" ", "");
    if (checkEmpty) {
      db.collection("rooms").doc(roomid).collection("messages").add({
        message:input,
        name:user.displayName,
        timestamp:firebase.firestore.FieldValue.serverTimestamp()
      })
      setinput("");
    }
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${roomid}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
         {messages?.length>0?<p>last seen at...{new Date(messages[messages.length-1]?.timestamp?.toDate()).toUTCString()}</p>:""}
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages?.map((message) => (
          <p className={`chat__message ${message.name===user.displayName && `chat__reciever`}`}>
            <span className="chat__name">{message.name}</span>
            <div className="chat__messageInfo">
              <p>{message.message}</p>
              <span className="chat__timestamp">{new Date(message.timestamp?.toDate()).toUTCString()}</span>
            </div>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form action="post" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setinput(e.target.value)}
          />
          <button type="submit">
            {input.replaceAll(" ", "") ? <SendIcon /> : <MicIcon />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
