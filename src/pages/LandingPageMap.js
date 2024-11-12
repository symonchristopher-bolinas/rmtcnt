import React from 'react';
import NavigationBar from '../components/NavigationBar';
import Map from '../components/Map';
import { NavLink, Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css'
import TreeList from '../components/TreeList';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import Faqs from '../components/Faqs';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';


const LandingPageMap = () => {
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
        <div>
        <Link to='/' className="button_view" role="button">Back to Home</Link>
        </div>
    </>
  );
};

export default LandingPageMap;
