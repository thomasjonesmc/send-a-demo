import React from "react";
import Header from "components/header/Header";
import { Routes } from "components/routes/Routes";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "context/UserContext";
import "style.css";

export default function App() { 
  return (
    <BrowserRouter>
    <UserProvider>
      <div id="app">
        <Header />
        <Routes />
      </div>
    </UserProvider>
    </BrowserRouter>
  );
}
