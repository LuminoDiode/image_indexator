import React from "react";
import cl from './main.module.css';

const AppMain = ({children, ...props}) => {
    return (
        <div role={'main'} className={cl.appMain} {...props}>
            <div>
                <input placeholder="search your meme..." className={cl.searchInput} />
                {children}
            </div>
        </div>
    )
}

export default AppMain;