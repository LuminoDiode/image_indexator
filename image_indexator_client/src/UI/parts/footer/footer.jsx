import React from "react";
import cl from './footer.module.css';

const AppFooter = ({ ...props }) => {
    return (
        <footer className={cl.appFooter}>
            <div style={{ padding: '2vh' }}>
                <p className={cl.footerText}>This is an opensource project!</p>
                <a className={cl.footerText} href="https://github.com/LuminoDiode/image_indexator"><p>GitHub</p></a>
            </div>
        </footer>
    )
}

export default AppFooter;