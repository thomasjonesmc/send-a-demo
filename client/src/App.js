import React, { useContext } from "react";
import Header from "components/header/Header";
import UserContext from "context/UserContext";
import { Routes } from "components/routes/Routes";
import { BrowserRouter } from "react-router-dom";
import "style.css";

export default function App() { 

  const { user, loading } = useContext(UserContext);

  if (loading) return null;
  
  return (
    <BrowserRouter>
      <div id="app">
        <Header />
        <Routes user={user} />
      </div>
    </BrowserRouter>
  );
}
