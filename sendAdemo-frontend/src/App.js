import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import MyDemos from "./components/pages/MyDemos";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserContext from "./context/UserContext";
import CreateDemo from "./components/pages/CreateDemo";
import DemoHub from "./components/pages/DemoHub";

import "./style.css";
import "./tailwind.output.css";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post("/users/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });
      if (tokenRes.data) {
        const userRes = await Axios.get("/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };
    checkLoggedIn();
  }, []);
  /* ^^^
    If no values are passed to useEffect, the hook will only be ran once at the start*/

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
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
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}
