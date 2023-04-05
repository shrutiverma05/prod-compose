import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PrivateRoute = (props: any) => {
  const { Component } = props;
  const navigate = useNavigate();
  let { user, botProp } = useContext(AuthContext);
  useEffect(() => {
    user ? console.log(true) : navigate("/");
    if (!user && !botProp) {
      navigate("/");
    }
  });
  return (
    <>
      <Component />
    </>
  );
};

export default PrivateRoute;
