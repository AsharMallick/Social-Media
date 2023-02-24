import User from '../models/User.js' 
import jwt from 'jsonwebtoken'
import ErrorHandler from '../utils/errorHandler.js'
export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please login first", 401))
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
}