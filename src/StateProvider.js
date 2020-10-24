import React,{ createContext, useContext, useReducer } from "react";
const StateContext = createContext();
export const StateProvider=({reducer,initalState,children})=>{
    return(
    <StateContext.Provider value={useReducer(reducer,initalState)}>
    {children}
    </StateContext.Provider>
    );
};
export const useStatevalue=()=>useContext(StateContext);


