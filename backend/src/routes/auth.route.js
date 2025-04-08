import express from 'express';
import {protectRoute} from '../middlewares/protectRoute.middleware.js'
import {login,signup,logout, updateProfile, checkAuth} from '../controllers/auth.controller.js'
const Router = express.Router();
Router.post('/signup',signup)
Router.post('/login',login)
Router.post('/logout',logout)
Router.put('/update-profile',protectRoute,updateProfile)
Router.get('/check',protectRoute,checkAuth)
export default Router;