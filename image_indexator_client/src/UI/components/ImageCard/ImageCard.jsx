import React from "react";
import cl from './ImageCard.module.css';

const ImageCard = ({imageUrl,metaText,...props}) => {
    return (
        <div className={cl.imageCard} {...props}>
            <img src={imageUrl} className={cl.imageCardImage} alt={""}></img>
            <div className={cl.imageCardText}>{metaText}</div>
        </div>
    )
}

export default ImageCard; 