import React from 'react';
import './App.scss';
import SignUser from './components/SignUser';
import ListUsers from './components/ListUsers';
import Posts from './components/Posts';

function App() {
  return (
    <div className="app-container">
      <h1 className="title">Simple Social</h1>
      <div className="content">
        <div className="left-pane">
          <SignUser />
          <ListUsers />
        </div>
        <div className="main-pane">
          <Posts />
        </div>
      </div>
    </div>
  );
}

export default App;
