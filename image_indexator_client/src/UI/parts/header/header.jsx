import React from "react";
import LoginBlock from "../../components/LoginBlock/LoginBlock";
import cl from './header.module.css';

const AppHeader = ({ ...props}) => {
    return (
        <header className={cl.appHeader} {...props}>
                <div className={cl.appHeaderPart} id={cl.leftHeaderPart}>
                    <div className={'verticalCenter'}>Image Indexator</div>
                </div>
                <div className={cl.appHeaderPart} id={cl.rightHeaderPart}>
                   <LoginBlock className={'verticalCenter'}>

                   </LoginBlock>
                </div>
        </header>
    )
}

export default AppHeader;