import express from 'express'
import { createPost, likeUnlikePost, deletePost, getPostOfFollowing, updateCaption, commentOnPost, deleteComment } from '../controllers/post.js'
import { isAuthenticated } from '../middlewares/auth.js'
const router = express.Router()

router.route('/post/upload').post(isAuthenticated, createPost)
router.route('/post/:id').get(isAuthenticated, likeUnlikePost).put(isAuthenticated, updateCaption).delete(isAuthenticated, deletePost);
router.route('/posts').get(isAuthenticated, getPostOfFollowing);
router.route('/post/comment/:id').post(isAuthenticated, commentOnPost).delete(isAuthenticated, deleteComment);
export default router;