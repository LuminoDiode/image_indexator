import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginForm from "../LoginModal/LoginForm";
import MyModal from "../modal/MyModal";
import cl from './LoginBlock.module.css';
import { useCookies } from 'react-cookie';

const LoginBlock = ({...props}) => {
    const [isAuthed, setAuthed] = useState(checkIsAuthed());
    const [isLoginModalVisible, setLoginModalVisible] = useState(false)
    const [emailCookie,setEmailCookie] = useCookies(['Email']);
    function checkIsAuthed() {
        return (axios.get("https://localhost:7099/api/auth").code == 200);
    }

    function logoutFunc(){
        setEmailCookie('JwtToken','');
        setEmailCookie('Email','');
        setAuthed(false);
    }

    return (
        <div {...props}>
            {(isAuthed == false) ?
                <div>
                    <div>
                        <button className={cl.loginBtn} onClick={() => setLoginModalVisible(true)}>Login</button>
                    </div>
                    <MyModal isVisible={isLoginModalVisible} setVisible={setLoginModalVisible}>
                        <LoginForm onSuccessCallback={() => { setAuthed(true); setLoginModalVisible(false); }}>

                        </LoginForm>
                    </MyModal>
                </div>
                :
                <div>
                    <span>
                    Account: {emailCookie.Email.split('@')[0]}
                    </span>
                    <div style={{display:'flex',justifyContent:'center'}}>
                    <button className={cl.loginBtn} onClick={e=>{logoutFunc(); setAuthed(false); e.stopPropagation();}}>Logout</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default LoginBlock;