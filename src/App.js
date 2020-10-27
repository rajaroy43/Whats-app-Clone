import React, { useEffect } from "react";
import "./App.css";
import Chat from "./Chat";
import SideBar from "./SideBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import { useStatevalue } from "./StateProvider";
import firebase from 'firebase';
import Welcome from "./Welcome";
function App() {
  const [{ user }, dispatch] = useStatevalue();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
       
        dispatch({
          type:"SET_USER",
          user:user
      })
      }
      else{
        dispatch({
          type:"SET_USER",
          user:null
      })
      }
    })
  }, [])
  return (
    <div className="app">
      {user ? (
        <div className="app__body">
          <Router>
          <SideBar />
            <Switch>
              <Route path="/" exact>
                <Welcome/>
              </Route>
              <Route path="/rooms/:roomid">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
