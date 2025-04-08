import express from 'express';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/protectRoute.middleware.js';
const Router = express.Router();
Router.get('/user',protectRoute,getUsersForSidebar)
Router.get('/:id',protectRoute,getMessages)
Router.post('/send/:id',protectRoute,sendMessage)
export default Router

