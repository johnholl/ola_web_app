 
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "./App.css";
import 'antd/dist/antd.css';
import PublicPage from './components/PublicPage';
import AdminPage from './components/AdminPage';
import Login from './components/Login';
import UserProvider, {UserContext} from './providers/UserProvider'

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Switch>
            <Route path="/Map" component={PublicPage} />
            <Route path="/Admin" component={AdminPage} />
            <Route path="/Login" component={Login} />
          </Switch>
        </div>
    </Router>
  </UserProvider>
  );
}

export default App;