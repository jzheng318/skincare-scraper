import React from 'react';
import { Link } from 'react-router-dom';
// import SearchBar from './seachbar';
// import SignedIn from './signedIn';
// import SignedOut from './signedOut';

const NavBar = () => {
  return (
    <div className="navbar-fixed">
      <nav className="nav-wrapper">
        <div className="container">
          <Link to="/" className="brand-logo">
            <i className="large material-icons">face</i>
            Makeup Scraper
          </Link>
          {/* <SignedIn />
          <SignedOut /> */}
          {/* <SearchBar /> */}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
