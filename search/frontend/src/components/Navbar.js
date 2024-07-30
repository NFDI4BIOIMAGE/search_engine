import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/papers">Papers</Link></li>
        <li><Link to="/workflow-tools">Workflow Tools</Link></li>
        <li><Link to="/youtube-channels">YouTube Channels</Link></li>
        <li><Link to="/materials">Materials</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
