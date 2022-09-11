import React from "react";
import { useState } from "react";
import cl from './ImageCard.module.css';

const ImageCard = ({ imageUrl, metaText, ...props }) => {
    return (
        <div className={cl.imageCard} {...props} onClick={()=>showModal()}>
            <img src={imageUrl} className={cl.imageCardImage} alt={""}></img>
            <div className={cl.imageCardText}>{metaText}</div>
        </div>
    )
}

export default ImageCard; 