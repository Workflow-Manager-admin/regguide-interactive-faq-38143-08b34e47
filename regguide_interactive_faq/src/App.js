import React from 'react';
import './App.css';
import MainContainer from './MainContainer';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application wrapper.
   * Renders MainContainer for RegGuide Interactive FAQ beneath a fixed navbar.
   */
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <span />
          </div>
        </div>
      </nav>
      <main>
        <MainContainer />
      </main>
    </div>
  );
}

export default App;