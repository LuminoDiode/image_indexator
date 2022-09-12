import React from "react";
import ImageCard from "../ImageCard/ImageCard";
import cl from './ImageCardsList.module.css';

const ImageCardsList = ({imagesList,...props})=>{
    console.log(`Creating ImageCardsList with ${imagesList.length} images.`)
    return(
        <div className={cl.imageCardsList}>
            {imagesList.map((img,index) => 
                <ImageCard key={index} metaText={img.metadata} imageUrl={img.url}/>
            )}
        </div>
    )
}

export default ImageCardsList;