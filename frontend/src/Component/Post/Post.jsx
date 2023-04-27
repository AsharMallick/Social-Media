import { Avatar, Button, Typography, Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import User from "../User/User";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import {
  likePost,
  addComment,
  updatePost,
  deletePost,
} from "../../Actions/Post";
import {
  getMyPosts,
  getPostOfFollowing,
  getUserPosts,
  loadUser,
} from "../../Actions/User";
import CommentCard from "../CommentCard/CommentCard";

const Post = ({
  postId,
  caption,
  postImage,
  likes,
  comments,
  ownerImage,
  ownerName,
  ownerId,
  isAccount,
  isDelete,
  isUserProfile,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesToggle, setLikesToggle] = useState(false);
  const [commentsToggle, setCommentsToggle] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState(false);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const handleLike = async () => {
    setLiked(!liked);
    await dispatch(likePost(postId));
    if (isAccount) {
      dispatch(getMyPosts());
    } else if (isUserProfile) {
      dispatch(getUserPosts(params.id));
    } else {
      dispatch(getPostOfFollowing());
    }
  };
  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(addComment(commentValue, postId));
    if (isAccount) {
      dispatch(getMyPosts());
    } else if (isUserProfile) {
        console.log("userprofile")
      dispatch(getUserPosts(params.id));
    } else {
      dispatch(getPostOfFollowing());
    }
  };
  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);
  const updateCaptionHandler = async (e) => {
    e.preventDefault();
    await dispatch(updatePost(captionValue, postId));
    await dispatch(getMyPosts());
    dispatch(loadUser());
  };
  const deletePostHandler = async () => {
    await dispatch(deletePost(postId));
    await dispatch(getMyPosts());
    dispatch(loadUser());
  };
  return (
    <div className="post">
      <div className="postHeader">
        {isAccount ? (
          <Button onClick={() => setCaptionToggle(!captionToggle)}>
            <MoreVert />
          </Button>
        ) : null}
      </div>
      <img src={postImage} alt="Post" />
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{ height: "3vmax", width: "3vmax" }}
        />
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0, 0, 0, 0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>
      <button
        onClick={() => setLikesToggle(!likesToggle)}
        disabled={likes.length > 0 ? false : true}
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
      >
        <Typography>
          {likes.length === 1
            ? likes.length + " Like"
            : likes.length + " Likes"}
        </Typography>
      </button>
      <div className="postFooter">
        <Button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </Button>
        <Button onClick={() => setCommentsToggle(!commentsToggle)}>
          <ChatBubbleOutline />
        </Button>
        {isDelete ? (
          <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
      </div>
      <Dialog open={likesToggle} onClose={() => setLikesToggle(!likesToggle)}>
        <div className="DialogBox">
          <Typography variant="h4">Liked By</Typography>
          {likes &&
            likes.length > 0 &&
            likes.map((like) => (
              <User
                key={like._id}
                userId={like._id}
                name={like.name}
                avatar={
                  "https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0"
                }
              />
            ))}
        </div>
      </Dialog>
      <Dialog
        open={commentsToggle}
        onClose={() => setCommentsToggle(!commentsToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>
          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Comment here"
              required
            />
            <Button variant="contained" type="submit">
              Add Comment
            </Button>
          </form>
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                commentId={comment._id}
                postId={postId}
                userId={comment.user._id}
                comment={comment.comment}
                name={comment.user.name}
                isAccount={isAccount}
                avatar={
                  comment.user.avatar.url ||  "https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0"
                }
                isUserProfile={isUserProfile}
              />
            ))
          ) : (
            <Typography>No comments Yet</Typography>
          )}
        </div>
      </Dialog>
      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Edit Caption</Typography>
          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Update caption"
              required
            />
            <Button variant="contained" type="submit">
              Update
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Post;
