import { Avatar, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Register.css";
import { useAlert } from "react-alert";
import { register } from "../../Actions/User";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState();
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, user } = useSelector((state) => state.user);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [dispatch, error, alert]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(register(name, email, password, avatar));
    console.log(name, email, password, avatar);
  };
  useEffect(() => {
    if (!name || !email || !password || !avatar || loading) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [name, alert, email, password, avatar, loading, disabled]);
  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social Aap
        </Typography>
        <Avatar
          className="imagetag"
          src={avatar}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="name"
          className="registerInputs"
          placeholder="Name"
          required
          minLength={3}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="registerInputs"
          placeholder="Email"
          required
          minLength={3}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="registerInputs"
          placeholder="Password"
          required
          minLength={3}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/">
          <Typography>Already Registered?</Typography>
        </Link>
        <Button disabled={disabled} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Register;
