import React from "react";
import cl from './memeCard.module.css';

const MemeCard = ({imageUrl,metaText,...props}) => {
    return (
        <div className={cl.memeCard} {...props}>
            <img src={imageUrl} className={cl.memeCardImage}></img>
            <div className={cl.memeCardText}>{metaText}</div>
        </div>
    )
}

export default MemeCard;