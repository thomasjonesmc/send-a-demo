import React from "react";
import { Button } from "components/reusable/button/Button";
import "components/pages/home/home.css";

export default function Home() {
  
  const buttonStyle = {
    margin: "20px 10px"
  }

  return (
    <>
      <div id="homeHeader">
        <h2>Welcome to Send A Demo!</h2>
        <h3>To get started making/sharing demos, register or sign in!</h3>
        <div id="homeBtns">
          <Button path="register" style={buttonStyle}>Register</Button>
          <Button path="login" style={buttonStyle}>Login</Button>
        </div>
      </div>

      <div id="homeBody">
        <HomeMessage title="Demos done easy" text="Record, share, collaborate, create! It has never been easier to record with a friend." />
        <HomeMessage title="Rock on! 🎸" text="Go ahead and make an account to start recording!" />
      </div>
    </>
  )
}

const HomeMessage = ({title, text}) => (
  <div>
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
)