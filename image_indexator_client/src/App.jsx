import React, { useState, useEffect } from 'react';
import AppFooter from './UI/parts/footer/footer';
import AppHeader from './UI/parts/header/header';
import AppMain from './UI/parts/main/main';
import CookieConsent from "react-cookie-consent";
import Modal from 'react-modal';
import './App.css';

function App() {
  Modal.setAppElement('#root');

  return (
    <div>
      <CookieConsent location='bottom' cookieName='CookiesAccepted' expires={60} style={{ fontFamily: 'Courier New, Courier, monospace' }}>
        This website uses cookies to enhance the user experience.
      </CookieConsent>

      <AppHeader />
      <AppMain />
      <AppFooter />
    </div>
  );
}

export default App;