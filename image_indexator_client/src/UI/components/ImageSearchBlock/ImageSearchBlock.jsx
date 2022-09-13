import React, { useState, useEffect } from "react";
import ImageCardsList from "../ImageCardsList/ImageCardsList";
import axios from 'axios';
import cl from './ImageSearchBlock.module.css';
import { useCookies } from "react-cookie";


const ImageSearchBlock = ({ ...props }) => {
    console.log(`Creating ImageSearchBlock.`)
    const [userQuery, setQuery] = useState('');
    const [getCookie, setCookie] = useCookies();
    const [imagesList, setImagesList] = useState([]);

    const onPageLoad = useEffect(async () => {
        console.log(`Initializing ImageSearchBlock, sending empty query to server to receive recent images.`)
        await submitQuery('');
    }, [])

    async function submitQuery(userQr) {
        console.log(`Submitting user query to server: \'${userQr}\'.`);
        const host = window.location.protocol + "//" + window.location.host;
        const req = (await axios.post(host + '/api/image', { query: userQr }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie['JwtToken']
            }
        }));
        console.log(`Server responsed with code ${req.status}.`);
        if (req.status >= 200 && req.status < 300) {
            const images = req.data;
            if (images.length > 0) {
                console.log(`Receieved ${images.length} images from server.`)
                setImagesList(images);
            }
        }
    }

    return (
        <div {...props}>
            <input
                className={cl.searchInput}
                placeholder={"search your image..."}
                value={userQuery}
                onChange={e => { setQuery(e.target.value); }}
                onKeyUp={async e => {
                    if (e.key == 'Enter')
                        await submitQuery(userQuery);
                }} />
            <ImageCardsList imagesList={imagesList} />
        </div>
    )
}

export default ImageSearchBlock;