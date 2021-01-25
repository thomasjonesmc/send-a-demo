import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "components/ProtectedRoute";
import Header from "components/header/Header";
import Home from "components/pages/home/Home";
import MyDemos from "components/pages/myDemos/MyDemos";
import Login from "components/pages/login/Login";
import Register from "components/pages/register/Register";
import { UserProvider } from "context/UserContext";
import NewDemo from "components/pages/myDemos/NewDemo";
import Demo from "components/pages/demo/Demo";
import { Profile } from "components/pages/profile/Profile";
import { Follow } from "components/pages/follow/Follow";
import "style.css";


export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <div id="app">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <ProtectedRoute exact path="/my-demos" component={MyDemos} />
          <ProtectedRoute exact path="/new-demo" component={NewDemo} />
          <ProtectedRoute exact path="/demos/:demoId" component={Demo} />
          <ProtectedRoute exact path="/users/:userName" component={Profile} />
          <ProtectedRoute exact path="/users/:userName/followers" component={Follow} />
          <ProtectedRoute exact path="/users/:userName/following" component={Follow} />
          <Route path="/" render={() => <div className="center">404 - Page Not Found</div>} />
        </Switch>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}
