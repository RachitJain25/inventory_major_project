import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  //default axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      console.log("jhhjhj");
      console.log(parseData);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    //eslint-disable-next-line
  }, []);
  // Function to update auth state and local storage
  const updateAuth = (userData, token) => {
    const newAuth = { user: userData, token };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  // Function to clear auth state and local storage
  const logout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
  };
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
