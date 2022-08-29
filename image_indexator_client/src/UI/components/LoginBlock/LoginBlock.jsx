import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginForm from "../LoginModal/LoginForm";
import MyModal from "../modal/MyModal";
import cl from './LoginBlock.module.css';
import { useCookies } from 'react-cookie';

const LoginBlock = ({ onSuccessCallback, onFailCallback, ...props }) => {
    const [jwtTokenCookie, setJwtTokenCookie] = useCookies(['JwtToken']);
    const [emailCookie, setEmailCookie] = useCookies(['Email']);

    const [isAuthed, setAuthed] = useState(checkIsAuthed());
    const [isLoginModalVisible, setLoginModalVisible] = useState(false)

    const onLoad = useEffect(() => {
        console.log('isAuthed=' + isAuthed);
    }, []);

    function checkIsAuthed() {
       // console.log('in checkIsAuthed func');
        var check;
        try {
            const host = window.location.protocol + "//" + window.location.host;
            check = (axios.get(host+'/api/auth', {
                headers: { 'Authorization': 'Bearer ' + jwtTokenCookie['JwtToken'] }
            })).then(result=> {
                check=result.status;
                //console.log(result);
                if (check == 200) {
                    //console.log('Returned true from checkIsAuthed 2');
                    return true;
                }
                else {
                   // console.log('Returned false from checkIsAuthed 3');
                    return false;
                }
            });
        }
        catch {
            //console.log('Returned false from checkIsAuthed 1');
            return false;
        }

    }

    function logoutFunc() {
        setAuthed(false);
        setEmailCookie('JwtToken', '');
        setEmailCookie('Email', '');
    }

    return (
        <div {...props}>
            {(isAuthed == false) ?
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
                        Account: {emailCookie['Email']}
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