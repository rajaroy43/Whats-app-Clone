import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import db from './firebase';
import  './SidebarChat.css';
function SidebarChat({addNewChat,id,name}) {
    const [messages, setmessages] = useState([])
    useEffect(() => {
       if(id){
           db.collection("rooms").doc(id).collection("messages").orderBy("timestamp","desc").onSnapshot(snapshot=>(
               setmessages(snapshot.docs.map(doc=>doc.data()))
           ))
       }
    }, [id])
    const createChat=()=>{
        const roomName=window.prompt("Please enter name for yor room");
        if(roomName?.replaceAll(' ','')){
            db.collection("rooms").add({
                name:roomName
            })
        }
    }
    return !addNewChat?(
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${id}.svg`}/>
            <div className="sidebarChat__info">
                <h3>{name}</h3>
                <p>{messages[0]?.message}</p>
            </div>
        </div>
        </Link>
    ):(
        <div className="sidebarChat" onClick={createChat}>
            <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
