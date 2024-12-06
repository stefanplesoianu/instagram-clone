import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavbarUser } from "./NavbarUser";
import { NavbarGuest } from "./NavbarGuest";
import { YapContext } from "./Context";
import Login from "./Login";
import Register from "./Register";
import '../Styles/Home.css';

export default function Home() {
  const { user, guestId } = useContext(YapContext);
  const [isRegister, setIsRegister] = useState(false);

  const toggleAuthForm = () => {
    setIsRegister(prevState => !prevState);
  };

  return (
    <>
      {user ? (
        <>
          <header className="sidebar">
            <div className="header-content">
              <NavbarUser />
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </>
      ) : guestId ? (
        <>
          <header className="sidebar">
            <div className="header-content">
              <NavbarGuest />
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </>
      ) : (
        <div className="auth-container">
          {isRegister ? (
            <Register toggleForm={toggleAuthForm} />
          ) : (
            <Login toggleForm={toggleAuthForm} />
          )}
        </div>
      )}
    </>
  );
}
