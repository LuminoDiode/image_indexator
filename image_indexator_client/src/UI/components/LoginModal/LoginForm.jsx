import React, { useState } from 'react';
import cl from './LoginForm.module.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const LoginForm = ({onSuccessCallback, onFailCallback, logoutFunction: logoutFunctionToAssign})=>{
    console.log("Creating LoginForm.");
    const [loginValue,setLoginValue]=useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [getCookie,setCookie] = useCookies(['JwtToken']);
    const [serverMessage,setServerMessage] = useState('');
    const [isServerMessageDisplayed,setIsServerMessageDisplayed] = useState('none');

    async function tryLoginOrRigster() {
        console.log(`Trying to send auth claims ${loginValue}:${passwordValue} to server.`)
        const dataToSend = {email:loginValue, password: passwordValue};
        const host = window.location.protocol + "//" + window.location.host;
        const req = await axios.post(host+'/api/auth',dataToSend,{headers: {'Content-Type': 'application/json' }});
        const requestResult = req.data;
        if(requestResult.token){
            setCookie('JwtToken',requestResult.token);
            setCookie('Email',requestResult.email);
            setCookie('Id',requestResult.id);
            setIsServerMessageDisplayed('none');
            logoutFunctionToAssign = ()=>{setCookie('JwtToken','');setCookie('Email','');};
            console.log("Login was successfull.");
            onSuccessCallback();
        }
        else{
            setServerMessage(`Error: HTTP ${req.status}.`);
            setIsServerMessageDisplayed('block');
            console.log("Login failed.");
            onFailCallback();
        }
    }


    return(
        <form>
            <input className={cl.loginInput} type={'email'} placeholder='email' onChange={e=> setLoginValue(e.target.value)} value={loginValue}/>
            <input className={cl.loginInput} type={'password'} placeholder='password' onChange={e=> setPasswordValue(e.target.value)} value={passwordValue}/>
            <input className={cl.loginInput} type={'button'} onClick={tryLoginOrRigster} value={'Login/Register'}/>
            <p value={serverMessage} style={{display:{serverMessageDisplay: isServerMessageDisplayed}}}></p>
        </form>
    )
}

export default LoginForm;