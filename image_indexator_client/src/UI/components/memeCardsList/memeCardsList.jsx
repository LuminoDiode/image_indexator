import React from "react";
import MemeCard from "../memeCard/memeCard";
import cl from './memeCardsList.module.css';

const MemeCardsList = ({memesList,...props})=>{
    console.log(memesList);
    return(
        <div className={cl.memeCardsList}>
            {memesList.map((meme,index) => 
                <MemeCard key={index} metaText={meme.metaText} imageUrl={meme.imageUrl}/>
            )}
        </div>
    )
}

export default MemeCardsList;