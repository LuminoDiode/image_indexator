import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import LoginForm from "../LoginModal/LoginForm";
import MyModal from "../modal/MyModal";
import cl from './ImageUploadBlock.module.css';
import { useCookies } from 'react-cookie';
import { FileDrop } from "react-file-drop";
import Modal from 'react-modal';
import Tesseract from 'tesseract.js';

const ImageUploadBlock = ({ ...props }) => {
    const [getCookie, setCookie] = useCookies('');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('');
    const [imageMetadata, setImageMatadata] = useState('');
    Modal.setAppElement('#root');
    const fileInputRef = useRef(null);
    const onLoad = useEffect(() => {
        async function createWorkerNow() {
            if (!ImageUploadBlock.ocrWorker) {
                console.log('creating new OCR worker');
                ImageUploadBlock.ocrWorker = Tesseract.createWorker({
                    logger: m => console.log(m)
                });
                await ImageUploadBlock.ocrWorker.load();
                await ImageUploadBlock.ocrWorker.loadLanguage('eng+rus');
                await ImageUploadBlock.ocrWorker.initialize('eng+rus');
            }
        };
        createWorkerNow();
    });

    const onDrop = (files, event) => {
        console.log('onDrop');
        onGettingFile(files[0]);
    }
    const onFileInputChange = (event) => {
        console.log('onFileInputChange');
        onGettingFile(event.target.files[0]);
    }
    const onTargetClick = () => {
        fileInputRef.current.click()
    }

    const onGettingFile = async (file) => {
        console.log('onGettingFile');
        console.log(ImageUploadBlock.ocrWorker);
        console.log(file);
        ImageUploadBlock.currentFile = file;
        setIsOpen(true);
        const imgUrl = URL.createObjectURL(file);
        setPreviewSrc(imgUrl);
        console.log('calling Tesseract OCR');
        await ImageUploadBlock.ocrWorker.recognize(imgUrl)
            .then(({ data: { text } }) => { setImageMatadata(text); console.log('in tesseract then'); console.log(text); });
    }
    const closeModal = () => {
        setIsOpen(false);
    }

    const [sendButtonDisplay, setSendButtonDisplay] = useState('block');
    const sendPost = async () => {
        setSendButtonDisplay('none');
        console.log(ImageUploadBlock.currentFile);
        var result = await axios.put('http://localhost:5005/api/image', { file: ImageUploadBlock.currentFile }, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + getCookie['JwtToken']
            }
        });
        setSendButtonDisplay('block');
    }



    const modalCustomStyles = {
        content: {
            margin: 'auto',
            maxWidth: '600px',
            alignSelf: 'center'
        }
    };
    return (
        <div {...props}>

            <div>
                <FileDrop accept="image/*" onTargetClick={onTargetClick} className={cl.fileDrop} draggingOverTargetClassName={cl.fileDropHover} onDrop={onDrop} >Drop your image...</FileDrop>
                <input accept="image/*" onChange={onFileInputChange} ref={fileInputRef} type="file" hidden />
            </div>

            <Modal
                isOpen={modalIsOpen}
                contentLabel="Example Modal"
                onRequestClose={closeModal}
                style={modalCustomStyles}
            >
                <img id='prev' src={previewSrc} style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
                <p className={cl.metadataLable}>Insert image name and text to be used for search:</p>
                <input className={cl.metadataInput} style={{ width: '100%' }} placeholder={'Image metadata (for search)'} value={imageMetadata} onChange={e => setImageMatadata(e.target.value)}></input>
                <div style={{ width: '100%', margin: '1vh', boxSizing: 'border-box' }}><button type={'submit'} className={cl.uploadButton} onClick={sendPost} style={{ display: sendButtonDisplay, margin: 'auto' }}>Upload to server!</button></div>
            </Modal>

        </div>
    )
}

ImageUploadBlock.ocrWorker = null;
ImageUploadBlock.currentFile = null;

export default ImageUploadBlock;