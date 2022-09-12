import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginForm from "../LoginModal/LoginForm";
import MyModal from "../modal/MyModal";
import cl from './LoginBlock.module.css';
import { useCookies } from 'react-cookie';

const LoginBlock = ({ onSuccessCallback, onFailCallback, ...props }) => {
    console.log('Creating LoginBlock.');
    const [getCookie, setCookie] = useCookies();
    const [isAuthed, setAuthed] = useState(false);
    const [isLoginModalVisible, setLoginModalVisible] = useState(false)

    const onLoad = useEffect(() => {
        console.log("Initializing LoginBlock");
        setAuthed(checkIsAuthed);
        console.log(`Login block current state is \'${isAuthed ? `AUTHED AS ${getCookie['Email']}` : `NOT AUTHED`}\'.`)
    }, []);

    async function checkIsAuthed() {
        if (!getCookie['Email']) return false;
        var statusCode;
        try {
            console.log('Trying to validate JWT by sending it to server.');
            const host = window.location.protocol + "//" + window.location.host;
            statusCode = (await axios.get(host + '/api/auth', {
                headers: { 'Authorization': 'Bearer ' + getCookie['JwtToken'] }
            })).status;
        }
        catch {
            console.Console("Error occured while trying to send existing JWT to server for validation.");
            return false;
        }

        if (statusCode == 200) {
            console.log("Server validated existing JWT successfully.");
            return true;
        } else {
            console.log("Server rejected existing JWT.");
            return false;
        }
    }

    function logoutFunc() {
        setCookie('JwtToken', '');
        setCookie('Email', '');
        setAuthed(false);
    }

    return (
        <div {...props}>
            {(!isAuthed) ?
                <div>
                    <div>
                        <button className={cl.loginBtn} onClick={() => { console.log(!isLoginModalVisible); setLoginModalVisible(!isLoginModalVisible); }}>Login</button>
                    </div>
                    <MyModal isVisible={isLoginModalVisible} setVisible={setLoginModalVisible}>
                        <LoginForm onSuccessCallback={() => { setAuthed(true); setLoginModalVisible(false); }} onFailCallback={onFailCallback}>

                        </LoginForm>
                    </MyModal>
                </div>
                :
                <div>
                    <span>
                        Account: {getCookie['Email']}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className={cl.loginBtn} onClick={e => { logoutFunc(); setAuthed(false); e.stopPropagation(); }}>Logout</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default LoginBlock;