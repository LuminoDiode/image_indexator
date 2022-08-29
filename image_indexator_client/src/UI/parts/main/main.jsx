import React from "react";
import ImageUploadBlock from "../../components/ImageUploadBlock/ImageUploadBlock";
import cl from './main.module.css';
import ImageSearchBlock from "../../components/ImageSearchBlock/ImageSearchBlock";

const AppMain = ({ ...props }) => {
    return (
        <div role={'main'} className={cl.appMain} {...props}>
            <div style={{ padding: '1vh 0vw' }}>
                <ImageUploadBlock className={cl.imageUploadBox} />
            </div>
            <ImageSearchBlock style={{ margin: '0vh 10vw 1vh 10vw'  }} />
        </div>
    )
}

export default AppMain;