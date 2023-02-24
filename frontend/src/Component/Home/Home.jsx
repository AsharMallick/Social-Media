import React, { useEffect } from "react";
import User from "../User/User";
import Post from "../Post/Post";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { getPostOfFollowing, getAllUsers } from "../../Actions/User";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";
const Home = () => {
  const { loading, posts, error } = useSelector(
    (state) => state.postOfFollowing
  );
  const dispatch = useDispatch();
  const alert = useAlert();
  const {
    user,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.allUsers);
  const {
    error: postError,
    message,
    loading: likeLoading,
  } = useSelector((state) => state.like);
  useEffect(() => {
    dispatch(getPostOfFollowing());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (postError) {
      alert.error(postError);
      dispatch({ type: "clearErrors" });
    }
    if (usersError) {
      alert.error(usersError);
      dispatch({ type: "clearErrors" });
    }
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessages" });
    }
  }, [error, message, postError, dispatch, usersError, alert]);

  return loading === true || usersLoading === true || likeLoading === true ? (
    <Loader />
  ) : (
    <div className="home">
      <div className="homeleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              likes={post.likes}
              caption={post.caption}
              postImage={post.image.url}
              ownerId={post.owner._id}
              ownerName={post.owner.name}
              ownerImage={""}
              comments={post.comments}
              isDelete={false}
              isAccount={false}
            />
          ))
        ) : (
          <Typography>No posts yet</Typography>
        )}
      </div>
      <div className="homeright">
        {user && user.length > 0 ? (
          user.map((user) => (
            <User
              key={user._id}
              userId={user._id}
              name={user.name}
              avatar={
                user.avatar
                  ? user.avatar.url
                  : "https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0"
              }
            />
          ))
        ) : (
          <Typography>No Users Yet</Typography>
        )}
      </div>
    </div>
  );
};

export default Home;
