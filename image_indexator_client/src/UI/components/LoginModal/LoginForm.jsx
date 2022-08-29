import React, { useState } from 'react';
import cl from './LoginForm.module.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const LoginForm = ({onSuccessCallback, onFailCallback, logoutFunction: logoutFunctionToAssign})=>{
    const [loginValue,setLoginValue]=useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [JwtCookie,setJwtCookie] = useCookies(['JwtToken']);
    const [serverMessage,setServerMessage] = useState('')
    const [serverMessageDisplay,setServerMessageDisplay] = useState('none')

    async function tryLoginOrRigster() {
        const dataToSend = {email:loginValue, password: passwordValue};
        const host = window.location.protocol + "//" + window.location.host;
        const req = await axios.post(host+'/api/auth',dataToSend,{headers: {'Content-Type': 'application/json' }});
        console.log(req);
        const requestResult = req.data;
        if(requestResult.token){
            setJwtCookie('JwtToken',requestResult.token);
            setJwtCookie('Email',requestResult.email);
            setServerMessageDisplay('none');
            logoutFunctionToAssign = ()=>{setJwtCookie('JwtToken','');setJwtCookie('Email','');};
            onSuccessCallback();
        }
        else{
            setServerMessage(requestResult);
            setServerMessageDisplay('block');
            onFailCallback();
        }
    }


    return(
        <form>
            <input className={cl.loginInput} type={'email'} placeholder='email' onChange={e=> setLoginValue(e.target.value)} value={loginValue}/>
            <input className={cl.loginInput} type={'password'} placeholder='password' onChange={e=> setPasswordValue(e.target.value)} value={passwordValue}/>
            <input className={cl.loginInput} type={'button'} onClick={tryLoginOrRigster} value={'Login/Register'}/>
            <p value={serverMessage} style={{display:{serverMessageDisplay}}}></p>
        </form>
    )
}

export default LoginForm;