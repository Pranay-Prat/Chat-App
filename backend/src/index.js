import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import connectDB from './lib/db.js';
import { app, server } from './lib/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Trust Railway/Proxy to correctly report HTTPS for secure cookies
app.set('trust proxy', 1);

// Prefer provided PORT, fallback for local dev
const PORT = process.env.PORT || 5000;
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
  const distDir = path.join(__dirname, '../frontend/dist');
  const indexFile = path.join(distDir, 'index.html');
  if (fs.existsSync(indexFile)) {
    app.use(express.static(distDir));
    // Express 5 / path-to-regexp v6: use /(.*) for catch-all instead of *
    app.get('/(.*)', (req, res) => {
      res.sendFile(indexFile);
    });
  } else {
    console.log('Frontend dist not found; running in API-only mode.');
  }
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  connectDB();
});
