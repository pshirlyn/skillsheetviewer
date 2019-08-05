import React from "react";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import GridView from "./components/GridView";
import AppHeader from "./AppHeader";
import LoginCallback from "./components/LoginCallback";
import LandingPage from "./components/LandingPage";
import Refresh from "./components/Refresh";

const App: React.FC = () => {
  document.title = "Skillsheet Viewer";
  return (
    <Router>
      <CookiesProvider>
        <div className="App">
          <AppHeader />
          <Switch>
            <Route exact path="/refresh/:key" component={Refresh} />
            <Route exact path="/login/auth" component={LoginCallback} />
            <Route exact path="/" component={GridView} />
            <Route path="/" component={LandingPage} />
          </Switch>
        </div>
      </CookiesProvider>
    </Router>
  );
};

export default App;
