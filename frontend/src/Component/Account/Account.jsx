import { Avatar, Button, Dialog, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteProfile, getMyPosts, loadUser, logout } from '../../Actions/User'
import Loader from '../Loader/Loader'
import Post from '../Post/Post'
import User from '../User/User'
import './Account.css'
const Account = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, posts } = useSelector(state => state.myPosts)
    const { user, loading: usersLoading, message:userMessage } = useSelector(state => state.user)
    const { error: postError, message, loading: likeLoading } = useSelector(state => state.like)
    const [followersToggle, setFollowersToggle] = useState(false)
    const [followingToggle, setFollowingToggle] = useState(false)
    useEffect(() => {
        dispatch(getMyPosts());
        dispatch(loadUser());
    }, [dispatch])

    useEffect(() => {
        if (postError) {
            alert.error(postError);
            dispatch({ type: 'clearErrors' })
        }
        if (error) {
            alert.error(error)
            dispatch({ type: 'clearErrors' })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: 'clearMessages' })
        }
        if (userMessage) {
            alert.success(userMessage)
            dispatch({ type: 'clearMessages' })
        }
    }, [error, message, postError, dispatch, alert, userMessage])
    const logoutHandler = async() => {
        dispatch(logout());
        alert.success("Logged out successfully")
    }
    const deleteProfileHandler = async () => {
        await dispatch(deleteProfile())
        dispatch(loadUser())
    }
    return (
        loading === true || likeLoading === true  ||usersLoading === true ? <Loader /> : (
            <div className='account'>
                <div className="accountleft">
                    {
                        posts && posts.length > 0 ? posts.map((post) => (
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
                                isDelete={true}
                                isAccount={true}
                            />
                        )) : <Typography variant='h6'>No posts to show</Typography>
                    }
                </div>
                <div className="accountright">
                    <Avatar src={user.avatar.url || null} sx={{ height: "8vmax", width: '8vmax' }} />
                    <Typography variant='h5'>{user.name}</Typography>
                    <div>
                        <button onClick={()=>setFollowersToggle(!followersToggle)}>
                            <Typography>Followers</Typography>
                        </button>
                        <Typography>{user.followers.length}</Typography>
                    </div>
                    <div>
                        <button onClick={()=>setFollowingToggle(!followingToggle)}>
                            <Typography>Following</Typography>
                        </button>
                        <Typography>{user.following.length}</Typography>
                    </div>
                    <div>
                        <button>
                            <Typography>Posts</Typography>
                        </button>
                        <Typography>{user.posts.length}</Typography>
                    </div>
                    <Button variant='contained' onClick={logoutHandler}>Logout</Button>
                    <Link to='/update/profile'>Edit Profile</Link>
                    <Link to='/update/password'>Change Password</Link>
                    <Button variant='text' style={{ color: 'red', margin: '2vmax' }} onClick={deleteProfileHandler}>Delete My Profile</Button>

                    <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
                        <div className='DialogBox'>
                            <Typography variant='h4'>Followers</Typography>
                            {
                                user.followers && user.followers.length > 0 ? user.followers.map((follower) => (
                                    <User key={follower._id} userId={follower._id} name={follower.name} avatar={"https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0"} />
                                )):<Typography>You don't have any follower</Typography>
                            }
                        </div>
                    </Dialog>
                    <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
                        <div className='DialogBox'>
                            <Typography variant='h4'>Following</Typography>
                            {
                                user.following && user.following.length > 0 ? user.following.map((following) => (
                                    <User key={following._id} userId={following._id} name={following.name} avatar={"https://th.bing.com/th/id/R.3a59f13bbe775518072832cb0f308aa0?rik=kGcYyiCWmj4eQg&pid=ImgRaw&r=0"} />
                                )):<Typography>You don't follow anyone</Typography>
                            }
                        </div>
                    </Dialog>
                </div>
            </div>
        )
    )
}

export default Account
