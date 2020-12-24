import { createContext, useEffect, useState } from "react";
import Axios from "axios";

const UserContext = createContext(null);
export const UserProvider = (props) => {
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

  // return the UserContext.Provider with the values already baked in. This way our app component only has to be wrapped in the UserProvider
  // we could even override the value prop with different values if we wanted if we passed `value` in as props
  return <UserContext.Provider value={{ userData, setUserData }} {...props} />;
};

export default UserContext;
