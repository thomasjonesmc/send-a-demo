import { createContext, useEffect, useState } from "react";
import Axios from "axios";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  
    let token = localStorage.getItem("auth-token");
    
    Axios.get("/users", {
      headers: { "x-auth-token": token },
    })
    .then(res => setUser(res.data))
    .catch(() => setUser(null));
  
  }, []);

  // return the UserContext.Provider with the values already baked in. This way our app component only has to be wrapped in the UserProvider
  // we could even override the value prop with different values if we wanted if we passed `value` in as props
  return <UserContext.Provider value={{ user, setUser }} {...props} />;
};

export default UserContext;
