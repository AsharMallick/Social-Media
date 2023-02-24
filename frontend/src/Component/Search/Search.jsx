import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Actions/User";
import User from "../User/User";
import "./Search.css";
const Search = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.allUsers);
  useEffect(() => {
    dispatch(getAllUsers(name));
  }, [user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllUsers(name));
  };
  return (
    <div className="search">
      <form className="searchForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social Aap
        </Typography>
        <input
          type="name"
          placeholder="Search"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit">Submit</Button>
        <div className="searchResults">
          {user &&
            user.map((item) => (
              <User
                key={item._id}
                userId={item._id}
                name={item.name}
                avatar={item.avatar.url || null}
              />
            ))}
        </div>
      </form>
    </div>
  );
};

export default Search;
