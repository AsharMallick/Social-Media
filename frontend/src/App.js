import React, { useEffect } from "react";
import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Component/Header/Header";
import Login from "./Component/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./Actions/User";
import Home from "./Component/Home/Home";
import Account from "./Component/Account/Account";
import Newpost from "./Component/Newpost/Newpost";
import Register from "./Component/Register/Register";
import UpdateProfile from "./Component/UpdateProfile/UpdateProfile";
import UpdatePassword from "./Component/UpdatePassword/UpdatePassword";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
import ResetPassword from "./Component/ResetPassword/ResetPassword";
import UserProfile from "./Component/UserProfile/UserProfile";
import Search from "./Component/Search/Search";
import NotFound from "./Component/NotFound/NotFound";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated === false ? <Login /> : <Home />}
        />
        <Route
          path="/account"
          element={isAuthenticated === false ? <Login /> : <Account />}
        />
        <Route
          path="/newpost"
          element={isAuthenticated === false ? <Login /> : <Newpost />}
        />
        <Route
          path="/register"
          element={isAuthenticated === true ? <Account /> : <Register />}
        />
        <Route
          path="/update/profile"
          element={isAuthenticated === false ? <Login /> : <UpdateProfile />}
        />
        <Route
          path="/update/password"
          element={isAuthenticated === false ? <Login /> : <UpdatePassword />}
        />
        <Route
          path="/forgot/password"
          element={
            isAuthenticated === false ? <ForgotPassword /> : <UpdatePassword />
          }
        />
        <Route
          path="/password/reset/:token"
          element={
            isAuthenticated === false ? <ResetPassword /> : <UpdatePassword />
          }
        />
        <Route
          path="/user/:id"
          element={isAuthenticated === false ? <Login /> : <UserProfile />}
        />
        <Route
          path="/search"
          element={isAuthenticated === false ? <Login /> : <Search />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
