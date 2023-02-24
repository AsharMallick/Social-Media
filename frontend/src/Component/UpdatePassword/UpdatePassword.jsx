import React, { useEffect, useState } from "react";
import "./UpdatePassword.css";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../Actions/User";
import { useAlert } from "react-alert";
const UpdatePassword = () => {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const alert = useAlert();
  const { loading, message, error } = useSelector((state) => state.like);
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(updatePassword(newPassword, oldPassword));
  };
  useEffect(() => {
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessages" });
    }
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [dispatch, error, alert, message]);

  return (
    <div className="updatePassword">
      <form className="updatePasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social Aap
        </Typography>
        <input
          type="password"
          className="updatePasswordInputs"
          placeholder="Old Password"
          required
          minLength={3}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          className="updatePasswordInputs"
          placeholder="New Password"
          required
          minLength={3}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button disabled={loading} type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
