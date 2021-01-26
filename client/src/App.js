import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "components/ProtectedRoute";
import Header from "components/header/Header";
import Home from "components/pages/home/Home";
import MyDemos from "components/pages/myDemos/MyDemos";
import Login from "components/pages/login/Login";
import Register from "components/pages/register/Register";
import UserContext from "context/UserContext";
import NewDemo from "components/pages/myDemos/NewDemo";
import Demo from "components/pages/demo/Demo";
import { Profile } from "components/pages/profile/Profile";
import { Follow } from "components/pages/follow/Follow";
import "style.css";


export default function App() { 

  const { user, loading } = useContext(UserContext);
  console.log(user);

  if (loading) return null;
  return (
    <BrowserRouter>
        <Header />
        <div id="app">
          <Switch>
            <ProtectedRoute exact path="/" component={Home} condition={!user} redirect="/my-demos" />
            <ProtectedRoute exact path="/login" component={Login} condition={user === null} redirect="/my-demos"/>
            <ProtectedRoute exact path="/register" component={Register} condition={user === null} redirect="/my-demos" />
            <ProtectedRoute exact path="/my-demos" component={MyDemos} condition={user} />
            <ProtectedRoute exact path="/new-demo" component={NewDemo} condition={user} />
            <ProtectedRoute exact path="/demos/:demoId" component={Demo} condition={user} />
            <ProtectedRoute exact path="/users/:userName" component={Profile} condition={user} />
            <ProtectedRoute exact path="/users/:userName/followers" component={Follow} condition={user} />
            <ProtectedRoute exact path="/users/:userName/following" component={Follow} condition={user} />
            <Route path="/" render={() => <div className="center">404 - Page Not Found</div>} />
          </Switch>
        </div>
    </BrowserRouter>
  );
}
