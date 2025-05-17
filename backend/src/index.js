import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import connectDB from './lib/db.js';
import { app, server } from './lib/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend','dist','index.html'))
  })
};

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  connectDB();
});
