import { Avatar, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./UpdateProfile.css";
import { useAlert } from "react-alert";
import { register, updateProfile, loadUser } from "../../Actions/User";

const UpdateProfile = () => {
  const { loading, error, user } = useSelector((state) => state.user);
  const {
    loading: updateLoading,
    error: updateError,
    message,
  } = useSelector((state) => state.like);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState();
  const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
  const [disabled, setDisabled] = useState(true);

  const dispatch = useDispatch();
  const alert = useAlert();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setAvatarPrev(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (updateError) {
      alert.error(updateError);
      dispatch({ type: "clearErrors" });
    }
  }, [dispatch, error, alert]);
  useEffect(() => {
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessages" });
    }
  }, [message, dispatch, alert]);

  useEffect(() => {
    if (!name || !email || loading || updateLoading) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [alert, dispatch, name, email, avatar, loading, updateLoading, disabled]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(name, email, avatar));
    dispatch(loadUser());
  };

  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social Aap
        </Typography>
        <Avatar
          className="imagetag"
          src={avatarPrev}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="name"
          className="updateProfileInputs"
          placeholder="Name"
          required
          minLength={3}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="updateProfileInputs"
          placeholder="Email"
          required
          minLength={3}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button disabled={disabled} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};
export default UpdateProfile;
