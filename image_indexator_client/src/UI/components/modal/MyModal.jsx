import React from 'react';
import cl from './MyModal.module.css';

const MyModal = ({ children, isVisible, setVisible }) => {

    const rootClasses = [cl.myModal];
    if (isVisible) {
        rootClasses.push(cl.active);
    }

    return (
        <div className={rootClasses.join(' ')} onClick={()=>{ if(isVisible==true) setVisible(false);}}  >
            <div className={cl.myModalContent} onClick={e=> e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default MyModal;