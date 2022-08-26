import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import MemeCard from './UI/components/memeCard/memeCard';
import MemeCardsList from './UI/components/memeCardsList/memeCardsList';
import AppFooter from './UI/parts/footer/footer';
import AppHeader from './UI/parts/header/header';
import AppMain from './UI/parts/main/main';
import { useCookies } from 'react-cookie';
import CookieConsent from "react-cookie-consent";
import Modal from 'react-modal';

function App() {

  const [memes, setMemes] = useState([{ metaText: '', imageUrl: '' }]);

  const onPageLoad = useEffect(() => {
    loadAndSetMemes();
  }, [])

  async function loadAndSetMemes() { // if debug
    const response = await axios.get('https://jsonplaceholder.typicode.com/photos');
    const asMemes = response.data.slice(0, 8).map(pht => { return { metaText: pht.title, imageUrl: pht.url }; });
    //console.log(asMemes);
    setMemes(asMemes);
  }

  Modal.setAppElement('#root');

  return (
    <div>
      <AppHeader />
      <CookieConsent location='bottom' cookieName='CookiesAccepted' expires={60} style={{ fontFamily: 'Courier New, Courier, monospace' }}>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      <AppMain>
        <div style={{ margin: '0vh 10vw' }}>
          <MemeCardsList memesList={memes} />
        </div>
      </AppMain>
      <AppFooter />
    </div>
  );
}

export default App;
