import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import ImageCard from './UI/components/ImageCard/ImageCard';
import ImageCardsList from './UI/components/ImageCardsList/ImageCardsList';
import AppFooter from './UI/parts/footer/footer';
import AppHeader from './UI/parts/header/header';
import AppMain from './UI/parts/main/main';
import { useCookies } from 'react-cookie';
import CookieConsent from "react-cookie-consent";
import Modal from 'react-modal';

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
