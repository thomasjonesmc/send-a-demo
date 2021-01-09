import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "components/header/Header";
import Home from "components/pages/home/Home";
import MyDemos from "components/pages/myDemos/MyDemos";
import Login from "components/pages/login/Login";
import Register from "components/pages/register/Register";
import { UserProvider } from "context/UserContext";
import NewDemo from "components/pages/myDemos/NewDemo";
import Demo from "components/pages/demo/Demo";
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
          <Route exact path="/my-demos" component={MyDemos} />
          <Route exact path="/new-demo" component={NewDemo} />
          <Route exact path="/demos/:demoId" component={Demo} />
          <Route path="/" render={() => <div>404</div>} />
        </Switch>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}
