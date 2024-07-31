import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
      <Link to="/" className="navbar-brand p-0">
        <img src={logo} alt="Logo" style={{ height: '50px' }} />
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
          <Link to="/" className="nav-item nav-link">Home</Link>
          <Link to="/about" className="nav-item nav-link">About</Link>
          <Link to="/blog" className="nav-item nav-link">Blog</Link>
          <Link to="/events" className="nav-item nav-link">Events</Link>
          <Link to="/papers" className="nav-item nav-link">Papers</Link>
          <Link to="/workflow-tools" className="nav-item nav-link">Workflow Tools</Link>
          <Link to="/youtube-channels" className="nav-item nav-link">YouTube Channels</Link>
          <Link to="/materials" className="nav-item nav-link">Materials</Link>
        </div>
        <Link to="/register" className="btn btn-primary rounded-pill py-2 px-4 ms-lg-3">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
