
import React from "react";
import cl from './ImageShowModal.module.css';
import Modal from 'react-modal';
import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const ImageShowModal = ({ imageData, ...props }) => {
    const [getCookie,setCookie] = useCookies();
    const [isDeleted, setIsDeleted] = useState(false);

    const RequestDeletion = async (imageId)=> {
        const host = window.location.protocol + "//" + window.location.host;
        const req = (await axios.delete(host + '/api/image/' + imageId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie['JwtToken']
            }
        }));
        if (req.status >= 200 && req.status < 300){
            setIsDeleted(true);
        }
    }

    return (
        <Modal {...props}>
            <img src={imageData.url} style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
            <p className={cl.metadataLable}>{imageData.metadata}</p>
            {
               (imageData.owner && imageData.owner === getCookie['Id']) ?
                 <button class = {cl.deleteButton} onClick={()=>RequestDeletion(imageData.Id)} disabled={isDeleted}>
                    Delete
                 </button>
                 :
                 <span/>
            }
        </Modal>
    )
}

export default ImageShowModal;