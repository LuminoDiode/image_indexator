
import React from "react";
import cl from './ImageShowModal.module.css';
import Modal from 'react-modal';

const ImageShowModal = ({ imageData, ...props }) => {
    const modalCustomStyles = {
        content: {
            margin: 'auto',
            maxWidth: '600px',
            alignSelf: 'center'
        }
    };
    return (
        <Modal {...props}>
            <img src={imageData.url} style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
            <p className={cl.metadataLable}>{imageData.metadata}</p>
        </Modal>
    )
}


export default ImageShowModal;