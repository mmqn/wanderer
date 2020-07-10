import React, { useState, useEffect } from 'react';
import './styles/App.css';
import List from './List';
import Map from './Map';
import ErrorMessage from './util/ErrorMessage';

const PLACES_ENDPOINT = 'https://wanderer-mmqn.firebaseio.com/places.json';
const MAPBOX_APIKEY =
  'pk.eyJ1IjoibW1xbiIsImEiOiJjazAxNDdtMGUwN3RxM2JwNGxzYWdqeDltIn0.Ctg235d9st1jNa25YSaFlg';

export default () => {
  const [goodResponse, setGoodResponse] = useState(false);
  const [places, setPlaces] = useState([]);
  const [minimizeHeader, setMinimizeHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 415);

  const fetchData = async () => {
    const response = await fetch(PLACES_ENDPOINT);
    const status = response.status;
    const places = await response.json();

    if (status === 200) {
      setGoodResponse(true);
      setPlaces(places);
    } else {
      console.warn(status, response);
    }
    // .then(response => {
    //   const { status } = response;

    //   if (status === 200) {
    //     setGoodResponse(true);
    //     return response.json();
    //   }
    // })
    // .then(places => places);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleUpdateHeaderSize = window.addEventListener('scroll', () => {
      if (window.pageYOffset >= 40) setMinimizeHeader(true);
      else if (window.pageYOffset < 40) setMinimizeHeader(false);
    });

    const handleUpdateIsMobile = window.addEventListener('resize', ev => {
      const { innerWidth } = ev.target;

      if (innerWidth >= 415) setIsMobile(false);
      else if (innerWidth < 415) setIsMobile(true);
    });

    // Run on unmounting; cleanup
    return () => {
      window.removeEventListener('sroll', handleUpdateHeaderSize);
      window.removeEventListener('resize', handleUpdateIsMobile);
    };
  }, []);

  return (
    <>
      <h1
        className={`header ${
          minimizeHeader ? 'minimize-header' : 'maximize-header'
        }`}
      >
        Wanderer
      </h1>

      {goodResponse === true && places.length > 0 ? (
        <>
          {/* <List places={places} isMobile={isMobile} mapboxKey={MAPBOX_APIKEY} /> */}

          <Map mapboxKey={MAPBOX_APIKEY} />
        </>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
};
