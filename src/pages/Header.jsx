// src/components/Header.jsx
import React from "react";
import '../components/style/header.css';

const Header = () => (
  <header className="header">
    <div className="header-content">
      <h1 className="header-title">Water Distribution System</h1>
      <div className="water-animation">
        <div className="water-drop"></div>
        <div className="water-drop delay-1"></div>
        <div className="water-drop delay-2"></div>
      </div>
    </div>
  </header>
);

export default Header;