import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  followUnfollowUser,
  getUserPosts,
  getUserProfile,
} from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./UserProfile.css";
const UserProfile = () => {
  const { error: postsError, posts } = useSelector((state) => state.userPosts);
  const {
    user,
    loading: usersLoading,
    error: userError,
  } = useSelector((state) => state.user);
  const {
    user: User,
    loading,
    error,
  } = useSelector((state) => state.userProfile);
  const {
    message: followMessage,
    error: followError,
    loading: followLoading,
  } = useSelector((state) => state.like);
  console.log(User);

  const dispatch = useDispatch();
  const alert = useAlert();
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const params = useParams();

  useEffect(() => {
    console.log("useEffect");
    dispatch(getUserPosts(params.id));
    dispatch(getUserProfile(params.id));
    if (user._id === params.id) {
      setMyProfile(true);
    }
  }, [dispatch]);
  useEffect(() => {
    if (User) {
      console.log("kuch aya");
      User.followers.forEach((item) => {
        if (item._id === user._id) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
  }, [User]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (followError) {
      alert.error(followError);
      dispatch({ type: "clearErrors" });
    }
    if (followMessage) {
      alert.success(followMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, dispatch, alert, followMessage, followError]);

  const followHandler = async () => {
    await dispatch(followUnfollowUser(User._id));
    dispatch(getUserProfile(params.id));
    setFollowing(!following);
  };

  return usersLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
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
              isUserProfile={true}
            />
          ))
        ) : (
          <Typography variant="h6">No posts to show</Typography>
        )}
      </div>
      <div className="accountright">
        {User ? (
          <>
            <Avatar
              src={User.avatar.url || null}
              sx={{ height: "8vmax", width: "8vmax" }}
            />
            <Typography variant="h5">{User.name}</Typography>
            <div>
              <button onClick={() => setFollowersToggle(!followersToggle)}>
                <Typography>Followers</Typography>
              </button>
              <Typography>{User.followers.length}</Typography>
            </div>
            <div>
              <button onClick={() => setFollowingToggle(!followingToggle)}>
                <Typography>Following</Typography>
              </button>
              <Typography>{User.following.length}</Typography>
            </div>
            <div>
              <button>
                <Typography>Posts</Typography>
              </button>
              <Typography>{User.posts.length}</Typography>
            </div>

            {myProfile ? null : (
              <Button
                variant="contained"
                disabled={followLoading}
                style={{ backgroundColor: following ? "red" : "" }}
                onClick={followHandler}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Dialog
              open={followersToggle}
              onClose={() => setFollowersToggle(!followersToggle)}
            >
              <div className="DialogBox">
                <Typography variant="h4">Followers</Typography>
                {User.followers && User.followers.length > 0 ? (
                  User.followers.map((follower) => (
                    <User
                      key={follower._id}
                      userId={follower._id}
                      name={follower.name}
                      avatar={
                        "https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0"
                      }
                    />
                  ))
                ) : (
                  <Typography>No Following</Typography>
                )}
              </div>
            </Dialog>
            <Dialog
              open={followingToggle}
              onClose={() => setFollowingToggle(!followingToggle)}
            >
              <div className="DialogBox">
                <Typography variant="h4">Following</Typography>
                {User.following && User.following.length > 0 ? (
                  User.following.map((following) => (
                    <User
                      key={following._id}
                      userId={following._id}
                      name={following.name}
                      avatar={
                        "https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0"
                      }
                    />
                  ))
                ) : (
                  <Typography>No Followers</Typography>
                )}
              </div>
            </Dialog>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default UserProfile;
