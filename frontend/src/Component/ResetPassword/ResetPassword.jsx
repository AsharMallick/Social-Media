import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./ResetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { loadUser, resetPassword } from "../../Actions/User.js";
import { Link, useParams } from "react-router-dom";
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const { token } = useParams();
  const { loading, message, error } = useSelector((state) => state.like);
  console.log(token);
  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(resetPassword(token, newPassword));
    dispatch(loadUser());
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessages" });
    }
  }, [error, message, alert, dispatch]);

  return (
    <div className="resetPassword">
      <form className="resetPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social Aap
        </Typography>
        <input
          type="password"
          className="resetPasswordInputs"
          placeholder="New Password"
          required
          minLength={3}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Link to="/forgot/password">
          <Typography>Request Another Token?</Typography>
        </Link>
        <Button disabled={loading} type="submit">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
