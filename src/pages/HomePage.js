// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import Map from '../components/Map';
import '../styles/navbar.css'
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import TreeList from '../components/TreeList';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import Faqs from '../components/Faqs';
// import FAQ from '../components/FAQ';
// import Footer from '../components/Footer';
import { Navbar, Nav, NavDropdown, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MapFilterControls from '../components/MapFilterConrtrols';

function HomePage() {
  const clearTreeIdParameter = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('treeId');
    window.location.href = url.toString();

  };

  return (
    <>

      {/* Header Section */}
      <div>
        <div className='col m-12'></div>
        <NavigationBar />
      </div>

      {/* Map Section */}
      <div className='mapContainer'>
        <Map />
      </div>

      {/* TreeList Section */}
      <div className='treelist'>
        <TreeList />
      </div>

      {/* Gallery Section */}
      <div className='gallerys'>
        <Gallery />
      </div>

      {/* Faqs Section */}
      <div className='faqss'>
        <Faqs />
      </div>

      {/* Footer Section */}
      <footer className='footer1'>
        <Footer />
      </footer>
    </>
  );
};

export default HomePage;
