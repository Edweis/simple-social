import React, { useState } from 'react';
import './App.scss';
import SignUser from './components/SignUser';
import ListUsers from './components/ListUsers';
import Posts from './components/Posts';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const updateUser = partialUser => {
    setLoggedUser(currentUser => ({ ...currentUser, ...partialUser }));
  };
  const isConnected = loggedUser != null;
  const subscriptions = loggedUser ? loggedUser.subscriptions : [];
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
            isConnected={isConnected}
            updateUser={updateUser}
            subscriptions={subscriptions}
          />
        </div>
        <div className="main-pane">
          <Posts isConnected={isConnected} subscriptions={subscriptions} />
        </div>
      </div>
    </div>
  );
}

export default App;
