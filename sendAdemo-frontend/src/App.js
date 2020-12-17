import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import MyDemos from "./components/pages/MyDemos";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { UserProvider } from "./context/UserContext";
import CreateDemo from "./components/pages/CreateDemo";
import DemoHub from "./components/pages/DemoHub";
import "./style.css";

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
            <Route exact path="/demo/:path" component={DemoHub} />
            <Route path="/" render={() => <div>404</div>} />
          </Switch>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}
