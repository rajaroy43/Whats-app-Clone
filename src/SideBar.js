import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./SideBar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import db, { auth } from './firebase';
import { useStatevalue } from "./StateProvider";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
function SideBar() {
  const [rooms, setrooms] = useState([]);
  const [{ user },] = useStatevalue();
  useEffect(() => {
    const unsubscribe=db.collection("rooms").onSnapshot(snapshot=>(
      setrooms(snapshot.docs.map(doc=>({
        id:doc.id,
        data:doc.data()
      })))
    ))
    return ()=>{
      unsubscribe();
    }
  }, [ ])
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL}/>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <button onClick={e=>auth.signOut()} title="LogOut" className="sidebar__logout"><ExitToAppIcon/> </button>
        </div>
      </div>
      <div className="sidebarSearch__container">
        <div className="sidebar__search">
          <SearchIcon />
          <input type="text" placeholder="Search or start new Chat" />
        </div>
      </div>
      <div className="sidebar__chats">
          <SidebarChat addNewChat/>
         {rooms?.map(room=>(
           <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
         ))}
         
      </div>
    </div>
  );
}

export default SideBar;
