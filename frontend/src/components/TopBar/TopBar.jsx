import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoLogIn, IoMenuOutline, IoLogOut } from "react-icons/io5";
import { message } from "antd";
import "./TopBar.css";
import logo from "../../assets/images/sunnylogo.png";

const TopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Çıkış yapıldı");
    navigate("/login");
  };

  return (
    <div className="topBar">
      <div className="img-container">
        <div className="title">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
      </div>

      <div className="menuContainer">
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <IoMenuOutline />
        </div>
        <div className="menu-text">
          <ul className={menuOpen ? "open" : ""}>
            {!isAuthenticated && (
              <li>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  Giriş Yap
                </NavLink>
              </li>
            )}
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/users" onClick={() => setMenuOpen(false)}>
                    Kullanıcılar
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/projects" onClick={() => setMenuOpen(false)}>
                    Projeler
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/lists" onClick={() => setMenuOpen(false)}>
                    Listeler
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/rates" onClick={() => setMenuOpen(false)}>
                    Oranlar
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/professions" onClick={() => setMenuOpen(false)}>
                    Meslekler
                  </NavLink>
                </li>
                <li>
                  <button className="logout-button" onClick={handleLogout}>
                    <IoLogOut />
                  </button>
                </li>
              </>
            ) : (
              <li className="login-icon"></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
