import React, { useContext } from "react";
import Button from "../layout/Button";
import UserContext from "../../context/UserContext";
import { useHistory } from "react-router-dom";

export default function Home() {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const signedIn = () => history.push("/my-demos");

  return (
    <>
      {userData.user ? (
        signedIn()
      ) : (
        <>
          <div id="homeHeader">
            <h1 className="text-5xl text-bold text-center py-5">
              Welcome to Send a Demo! 👋
            </h1>

            <h3 className="text-xl text-center">
              To get started making/sharing demos, register or sign in!
            </h3>
          </div>

          <div className="flex  pt-20">
            <Button name="Register" path="/register" />
            <Button name="Sign in" path="/login" />
          </div>
          <div className="flex pt-12">
            <div className="w-3/4 mx-auto">
              <h2 className="underline text-lg font-bold">Demos done easy</h2>
              <p className="pt-3">
                Record, share, collaborate, create! It has never been easier to
                record with a friend.
              </p>
            </div>
          </div>
          <div className="flex pt-12">
            <div className="w-3/4 mx-auto">
              <h2 className="underline text-lg font-bold">Rock on! 🎸 </h2>
              <p className="pt-3">
                Go ahead and make an account to start recording!
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
