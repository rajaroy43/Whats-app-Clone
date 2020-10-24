import React from 'react'
import "./Login.css"
import{Button} from '@material-ui/core'
import { auth ,provider} from './firebase'
import { useStatevalue } from './StateProvider'
function Login() {
    const[,dispatch]=useStatevalue();
    const signIn=async()=>{
        try {
            const result=await auth.signInWithPopup(provider);
            dispatch({
                type:"SET_USER",
                user:result.user
            })
        } catch (error) {
            alert(error.message)
        }
    }
    return (
        <div className="login">
            <div className="login__container">
                <img src="https://image.flaticon.com/icons/png/512/124/124034.png" alt="whatsapp"/>
                <div className="login__text">
                    <h2>Sign in to whatsapp</h2>
                </div>
                <Button onClick={signIn}>Sign in With Google</Button>
            </div>
        </div>
    )
}

export default Login
