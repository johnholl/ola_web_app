 
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "./App.css";
import 'antd/dist/antd.css';
import PublicPage from './components/PublicPage';
import AdminPage from './components/AdminPage';
import Login from './components/Login';
import UserProvider from './providers/UserProvider'

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Switch>
            <Route path="/" component={PublicPage} exact/>
            <Route path="/admin" component={AdminPage} />
            <Route path="/login" component={Login} />
          </Switch>
        </div>
    </Router>
  </UserProvider>
  );
}

export default App;