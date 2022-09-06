import React, { useState, useEffect } from "react";
import ImageCardsList from "../ImageCardsList/ImageCardsList";
import axios from 'axios';
import cl from './ImageSearchBlock.module.css';
import { useCookies } from "react-cookie";


const ImageSearchBlock = ({ ...props }) => {
    const [userQuery, setQuery] = useState('');
    const [getCookie,setCookie] = useCookies();

    const [imagesList, setImagesList] = useState([{ metaText: '', imageUrl: '' }]);

    const onPageLoad = useEffect(() => {
        submitQuery('');
    }, [])

    async function submitQuery(userQr) {
        console.log('onQuerySubmit');
        const host = window.location.protocol + "//" + window.location.host;
        const images = (await axios.post(host + '/api/image', {query: userQr}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie['JwtToken']
            }
        })).data;
        setImagesList(images);
    }

    return (
        <div {...props}>
            <input className={cl.searchInput} placeholder={"search your image..."} value={userQuery} onChange={e => { setQuery(e.target.value); }} onKeyUp={e => { if (e.key == 'Enter') submitQuery(userQuery); }} />
            <ImageCardsList imagesList={imagesList} />
        </div>
    )
}

export default ImageSearchBlock;