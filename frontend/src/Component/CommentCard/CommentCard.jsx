import React from "react";
import "./CommentCard.css";
import { Link, useParams } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  getMyPosts,
  getPostOfFollowing,
  getUserPosts,
} from "../../Actions/User";
import { deleteComment } from "../../Actions/Post";
const CommentCard = ({
  userId, //Id of user who commented
  name,
  avatar = "https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0", //TODO
  comment,
  commentId,
  postId,
  isAccount,
  isUserProfile,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const deleteCommentHandler = () => {
    console.log("Ashar");
    dispatch(deleteComment(commentId, postId));
    if (isAccount) {
      console.log("Bring me my posts");
      dispatch(getMyPosts());
    } else if (isUserProfile) {
      console.log("userprofile");
      dispatch(getUserPosts(params.id));
    } else {
      dispatch(getPostOfFollowing());
    }
  };
  return (
    <div className="commentUser">
      <Link to={`/user/${userId}`}>
        <img src={avatar} alt={name} />
        <Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
      </Link>
      <Typography>{comment}</Typography>
      {isAccount ? (
        <Button onClick={deleteCommentHandler}>
          <Delete />
        </Button>
      ) : userId == user._id ? (
        <Button onClick={deleteCommentHandler}>
          <Delete />
        </Button>
      ) : null}
    </div>
  );
};

export default CommentCard;
