import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import cl from './ImageUploadBlock.module.css';
import { useCookies } from 'react-cookie';
import { FileDrop } from "react-file-drop";
import Modal from 'react-modal';
import Tesseract from 'tesseract.js';
import imageCompression from "browser-image-compression";
import ImageShowModal from "../ImageShowBlock/ImageShowModal";

const ImageUploadBlock = ({ ...props }) => {
    const [getCookie, setCookie] = useCookies('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [showBlockIsOpen, setShowBlockIsOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('');
    const [imageMetadata, setImageMatadata] = useState('');
    const [showImageData, setShowImageData] = useState({});
    const [sendButtonDisplay, setSendButtonDisplay] = useState('block');
    const fileInputRef = useRef(null);
    Modal.setAppElement('#root');

    const onLoad = useEffect(() => {
        async function createOcrWorker() {
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
        createOcrWorker();
    });

    const onDrop = (files, event) => onGettingFile(files[0]);
    const onFileInputChange = (event) => onGettingFile(event.target.files[0]);
    const onTargetClick = () => fileInputRef.current.click();


    const onGettingFile = async (file) => {
        console.log(`onGettingFile(${file})`);

        ImageUploadBlock.currentFile = file;
        setImageMatadata('');
        setSendButtonDisplay('block');
        setIsUploadModalOpen(true);
        const imgUrl = URL.createObjectURL(file);
        setPreviewSrc(imgUrl);

        console.log('calling ocrWorker');
        const recogResult = (await ImageUploadBlock.ocrWorker.recognize(imgUrl)).data.text;
        if (imageMetadata == '') {
            console.log('imageMetadata is empty and will be replaced with recognition result');
            setImageMatadata(recogResult);
        } else {
            console.log(`imageMetadata=${imageMetadata} is not empty and will not be replaced with recognition result`);
        }
    }

    const sendRequest = async () => {
        setSendButtonDisplay('none');

        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: 'image/jpeg'
        }
        const compressedFile = await imageCompression(ImageUploadBlock.currentFile, options);
        console.log(`File converted to JPEG and compressed to ${compressedFile.size / 1024} KB`);

        const host = window.location.protocol + "//" + window.location.host;
        var result = await axios.put(host+'/api/image', { file: compressedFile, metadata: imageMetadata }, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + getCookie['JwtToken']
            }
        });

        if (result.status >= 200 && result.status < 300) {
            console.log("Server returned put result:");
            console.log(result.data);
            setShowImageData(result.data);
            setIsUploadModalOpen(false);
            ImageUploadBlock.currentFile = null;
            setShowBlockIsOpen(true);
        }

        setImageMatadata('');
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
                isOpen={isUploadModalOpen}
                onRequestClose={() => { setIsUploadModalOpen(false); setImageMatadata(''); ImageUploadBlock.currentFile = null;}}
                style={modalCustomStyles}
            >
                <img src={previewSrc} style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
                <p className={cl.metadataLable}>Insert image name and text to be used for search:</p>
                <input className={cl.metadataInput} style={{ width: '100%' }} placeholder={'Image metadata (for search)'} value={imageMetadata} onChange={e => setImageMatadata(e.target.value)}></input>
                <div style={{ width: '100%', margin: '1vh 0px', boxSizing: 'border-box' }}><button type={'submit'} className={cl.uploadButton} onClick={sendRequest} style={{ display: sendButtonDisplay, margin: 'auto' }}>Upload to server!</button></div>
            </Modal>

            {showImageData ?
                <ImageShowModal
                    imageData={showImageData}
                    isOpen={showBlockIsOpen}
                    onRequestClose={() => setShowBlockIsOpen(false)}
                    style={modalCustomStyles}
                > </ImageShowModal>
                :
                {}
            }
        </div>
    )
}

ImageUploadBlock.ocrWorker = null;
ImageUploadBlock.currentFile = null;

export default ImageUploadBlock;