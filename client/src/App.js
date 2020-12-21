import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "components/header/Header";
import Home from "components/pages/home/Home";
import MyDemos from "components/pages/myDemos/MyDemos";
import Login from "components/pages/login/Login";
import Register from "components/pages/register/Register";
import { UserProvider } from "context/UserContext";
import CreateDemo from "components/pages/myDemos/CreateDemo";
import Demo from "components/pages/demo/Demo";
import "style.css";

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <div className="container mx-auto">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/my-demos" component={MyDemos} />
            <Route exact path="/create-demo" component={CreateDemo} />
            <Route exact path="/demo/:path" component={Demo} />
            <Route path="/" render={() => <div>404</div>} />
          </Switch>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}
