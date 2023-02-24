import { configureStore } from "@reduxjs/toolkit";
import {
  userReducer,
  postOfFollowingReducer,
  allUsersReducer,
  getUserPosts,
  getUserProfile,
} from "./Reducers/User";
import { postReducer, myPostReducer } from "./Reducers/Post";

const store = configureStore({
  reducer: {
    user: userReducer,
    postOfFollowing: postOfFollowingReducer,
    allUsers: allUsersReducer,
    like: postReducer,
    myPosts: myPostReducer,
    userPosts: getUserPosts,
    userProfile: getUserProfile,
  },
});

export default store;
