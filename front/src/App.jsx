import React, { useState } from 'react';
import './App.scss';
import SignUser from './components/SignUser';
import ListUsers from './components/ListUsers';
import Posts from './components/Posts';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const updateUser = partialUser => {
    console.debug({ partialUser });
    setLoggedUser(currentUser => ({ ...currentUser, ...partialUser }));
  };
  return (
    <div className="app-container">
      <h1 className="title">Simple Social</h1>
      <div className="content">
        <div className="left-pane">
          <SignUser
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
            updateUser={updateUser}
          />
          <ListUsers
            updateUser={updateUser}
            subscriptions={loggedUser ? loggedUser.subscriptions : []}
          />
        </div>
        <div className="main-pane">
          <Posts />
        </div>
      </div>
    </div>
  );
}

export default App;
