import React, { useState, useEffect } from "react";
import ImageCardsList from "../ImageCardsList/ImageCardsList";
import axios from 'axios';
import cl from './ImageSearchBlock.module.css';
import { useCookies } from "react-cookie";


const ImageSearchBlock = ({ ...props }) => {
    console.log(`Creating ImageSearchBlock.`)
    const [userQuery, setQuery] = useState('');
    const [getCookie,setCookie] = useCookies();
    const [imagesList, setImagesList] = useState([]);

    const onPageLoad = useEffect(() => {
        console.log(`Initializing ImageSearchBlock, sending empty query to server to receive recent images.`)
        submitQuery('');
    }, [])

    async function submitQuery(userQr) {
        console.log(`Submitting user query to server: \'${userQr}\'.`);
        const host = window.location.protocol + "//" + window.location.host;
        const req = (await axios.post(host + '/api/image', {query: userQr}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie['JwtToken']
            }
        }));
        if(!(req.status>=200 && req.status<300)){
            const images=req.data;
            if(images.length>0) setImagesList(images);
        }
    }

    return (
        <div {...props}>
            <input className={cl.searchInput} placeholder={"search your image..."} value={userQuery} onChange={e => { setQuery(e.target.value); }} onKeyUp={e => { if (e.key == 'Enter') submitQuery(userQuery); }} />
            <ImageCardsList imagesList={imagesList} />
        </div>
    )
}

export default ImageSearchBlock;