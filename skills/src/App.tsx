import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink as RRNavLink
} from "react-router-dom";

import GridView from "./components/GridView";
import AppHeader from "./AppHeader";

const App: React.FC = () => {
  return (
    <Router>
      <CookiesProvider>
        <div className="App">
          <AppHeader />
          <Switch>
            <Route exact path="/" component={GridView} />
          </Switch>
        </div>
      </CookiesProvider>
    </Router>
  );
};

export default App;
