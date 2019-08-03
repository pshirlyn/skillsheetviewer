import React from "react";
import { useCookies } from "react-cookie";
const useLogin = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const login = (email: string, token: string) => {};
  const logout = () => {
    removeCookie("name");
    removeCookie("token");
    removeCookie("email");
  };
  return { login, logout };
};

export default useLogin;
