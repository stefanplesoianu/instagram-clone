import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { YapContext } from './Context';
import '../Styles/Navbar.css'

function NavbarGuest() {

  const { handleLogout } = useContext(YapContext)

  return (
    <header className="navbar">
      <Link to="/" className="site-name">
        YapBook
      </Link>
      <nav>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          </li>
          <li>
            <NavLink to='/search' className={({ isActive }) => (isActive ? 'active' : '')}>Search</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Sign in</NavLink>
          </li>
          <li>
            <NavLink to="/" onClick={handleLogout} className={({ isActive }) => (isActive ? 'active' : '')}>Logout</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export { NavbarGuest };