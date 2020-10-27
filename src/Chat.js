import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from "@material-ui/icons/Send";
import { useParams } from "react-router-dom";
import db, { storage } from "./firebase";
import { useStatevalue } from "./StateProvider";
import GetAppIcon from "@material-ui/icons/GetApp";
import firebase from "firebase";
import Picker from "emoji-picker-react";
import ClearIcon from "@material-ui/icons/Clear";
import { ReactMic } from "react-mic";
import CheckIcon from "@material-ui/icons/Check";
function Chat() {
  const [input, setinput] = useState("");
  const { roomid } = useParams();
  const [roomName, setroomName] = useState("");
  const [messages, setmessages] = useState([]);
  const [{ user }] = useStatevalue();
  const [inputFile, setinputFile] = useState("");
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef(null);
  const [showEmoji, setshowEmoji] = useState(false);
  const [record, setrecord] = useState(false);
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

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roomid, messages.length]);
  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputFile) {
      const uploadTask = storage.ref(`File/${inputFile.name}`).put(inputFile);
      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
          alert(error.message);
          setinputFile("");
        },
        async () => {
          const url = await storage
            .ref("File")
            .child(inputFile.name)
            .getDownloadURL();
          console.log(url);
          //post imageinto database
          await db.collection("rooms").doc(roomid).collection("messages").add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            url: url,
          });
          setProgress(0);
        }
      );
    } else {
      const checkEmpty = input.replaceAll(" ", "");
      if (checkEmpty) {
        db.collection("rooms").doc(roomid).collection("messages").add({
          message: input,
          name: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
    setinput("");
    setinputFile("");
  };
  const handleChange = (event) => {
    if (event.target.files[0]) {
      setinputFile(event.target.files[0]);
    }
  };
  const onEmojiClick = (event, eventObj) => {
    setinput(input + eventObj.emoji);
  };
  const onData = (recordedBlob) => {
    // console.log("chunk of real-time data is: ", recordedBlob);
  };

  const onStop = (recordedBlob) => {
  //  setaudio(recordedBlob.blobURL);
  //  console.log(roomName);
  //  console.log(messages);
  
  };
  const sendAudio=(e)=>{
  // setisAudio(true);
  setrecord(false);
  }
  
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${roomid}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          {messages?.length > 0 ? (
            <p>
              last seen at...
              {messages
                ? new Date(
                    messages[messages.length - 1]?.timestamp?.toDate()
                  ).toUTCString()
                : ""}
            </p>
          ) : (
            ""
          )}
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
      <div className="chat__body" ref={scrollRef}>
        {messages?.map((message,index) => (
          <div>
            <p
              className={`chat__message ${
                message.name === user.displayName && `chat__reciever`
              }`
              }
            >
              <span className="chat__name">{message.name}</span>
              <div className="chat__messageInfo">
                <p>{message.message}</p>
                <span className="chat__timestamp">
                  {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
              </div>
            </p>
            {message.url ? (
              <div
                className={`chat__media ${
                  message.name === user.displayName && `chat__reciever `
                }`}
              >
                <embed src={message.url} />
                <a href={message.url} download>
                  <GetAppIcon />
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <div className="chat__footer">
        {!progress ? (
          <>
            <button onClick={() => setshowEmoji(!showEmoji)}>
              {showEmoji ? <ClearIcon /> : <InsertEmoticonIcon />}
            </button>

            {showEmoji && (
              <Picker onEmojiClick={onEmojiClick} className="emoji__picker" />
            )}
            <AttachFileIcon title="Attach" className="attach__file" />
            <form action="post" onSubmit={sendMessage}>
              <input type="file" name="" id="" onChange={handleChange} />
              <input
                type="text"
                value={input}
                onChange={(e) => setinput(e.target.value)}
                placeholder="Type a message"
              />

              <button type="submit">
                {input.replaceAll(" ", "") || inputFile ? (
                  <SendIcon />
                ) : (
                  <div className="chat__footerRight">
                    <button onClick={() => setrecord(!record)} type="button">
                      {record ? (
                        <ClearIcon className="clear__icon" />
                      ) : (
                        <MicIcon />
                      )}
                    </button>
                    <ReactMic
                      record={record}
                      className={`frequencyBars ${record}`}
                      onStop={onStop}
                      onData={onData}
                      strokeColor="red"
                      backgroundColor="#f0f0f0"
                      visualSetting="sinewave"
                      mimeType="audio/mp3"
                    />
                    {record && (
                      <button
                        className="right__icon"
                        onClick={sendAudio}
                      >
                        <CheckIcon />
                      </button>
                    )}
                  </div>
                )}
              </button>
            </form>
          </>
        ) : (
          <progress
            value={progress}
            max="100"
            className="imageUploader-progress"
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
