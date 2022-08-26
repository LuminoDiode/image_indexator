import React from "react";
import ImageUploadBlock from "../../components/ImageUploadBlock/ImageUploadBlock";
import cl from './main.module.css';

const AppMain = ({children, ...props}) => {
    return (
        <div role={'main'} className={cl.appMain} {...props}>
            <div>
                <input placeholder="search your image..." className={cl.searchInput} />
                <ImageUploadBlock className={cl.imageUploadBox} />
                {children}
            </div>
        </div>
    )
}

export default AppMain;