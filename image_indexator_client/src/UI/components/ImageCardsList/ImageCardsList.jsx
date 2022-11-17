import React from "react";
import ImageCard from "../ImageCard/ImageCard";
import cl from './ImageCardsList.module.css';

const ImageCardsList = ({imagesList,...props})=>{
    console.log(`Creating ImageCardsList with ${imagesList.length} images.`)
    // if(imagesList.length==0){
    //     imagesList = new Array(20);
    //     for(var i =0; i<20;i++)
    //         imagesList[i]={ url:'https://via.placeholder.com/150/f66b97', metadata:'https://via.placeholder.com/150/f66b97'};
    // }
    return(
        <div className={cl.imageCardsList}>
            {imagesList ? imagesList.map((img,index) => 
                <ImageCard key={index} metaText={img.metadata} imageUrl={img.url}/>) : <span/>
            }
        </div>
    )
}

export default ImageCardsList;