import Post from "../models/Post.js"
import User from "../models/User.js"
import ErrorHandler from "../utils/errorHandler.js"
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import cloudinary from 'cloudinary'
export const createPost = catchAsyncError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder:"posts"
    })
    const newPostData = {
        caption: req.body.caption,
        image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        },
        owner: req.user._id
    }
    //Creating a post
    const post = await Post.create(newPostData);
    //Adding post in user model
    const user = await User.findById(req.user._id)
    user.posts.unshift(post._id)
    await user.save()

    res.status(201).json({
        success: true, message:"Post created"
    })
});

export const likeUnlikePost = catchAsyncError(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404))
    }
    console.log(post)
    if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id)
        post.likes.splice(index, 1);
        await post.save();
        return res.status(200).json({
            success: true, message: "Post unliked"
        });
    }
    post.likes.push(req.user._id);
    await post.save();
    return res.status(200).json({
        success: true, message: "Post Liked"
    });
})

export const deletePost = catchAsyncError(async (req, res) => {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return next(new ErrorHandler("Post not found", 404))
      }
  
      if (post.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Unauthorized", 501))
      }
  
      await cloudinary.v2.uploader.destroy(post.image.public_id);
  
      await post.remove();
      //Removing post from user.posts array
      const user = await User.findById(req.user._id);  
      const index = user.posts.indexOf(req.params.id);
      user.posts.splice(index, 1);
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Post deleted",
      });
})
  
export const getPostOfFollowing = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    //Getting the post which owner is equal to the (above user) or (loggedIn user) following
    const posts = await Post.find({
        owner: {
            $in: user.following
        }
    }).populate("owner likes comments.user");
    
    res.status(200).json({posts:posts.reverse()})
})

export const updateCaption = catchAsyncError(async (req, res, next)=>{
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404));
    }
    console.log(`${post.owner} ${req.user._id}`)
    if (post.owner.toString() != req.user._id) {
        return next(new ErrorHandler("Unauthorized", 401));        
    }
    post.caption = req.body.caption;
    await post.save();
    res.status(200).json({
        success:true,
        message:"Caption updated",
        post
    })
})

export const commentOnPost = catchAsyncError(async(req, res, next)=>{
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorHandler("Post not found", 404));
    let commentIndex = -1;
    post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
            commentIndex = index;
        }
    })

    if (commentIndex !== -1) {
        post.comments[commentIndex].comment = req.body.comment;
        await post.save();
        res.status(200).json({
            success: true,
            message: "Comment updated"
        });
        
    } else {
        post.comments.push({
            user: req.user._id,
            comment: req.body.comment
        })
        await post.save();
        res.status(200).json({
            success: true,
            message: "Comment added"
        })
    }
})

export const deleteComment = catchAsyncError(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorHandler("Post not found", 404));
    if (post.owner.toString() === req.user._id.toString()) {
        post.comments.forEach((item, index) => {
            if (item._id.toString() === req.body.commentId) {
                return post.comments.splice(index, 1);
            }
        })
        await post.save();
        res.status(200).json({
            success: true,
            message: "Selected comment deleted"
        })
    } else {
        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                return post.comments.splice(index, 1);
            }
        })
        await post.save();

        res.status(200).json({
            success: true,
            message: "Your comment has been deleted"
        })
    }
})