require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(express.json());
app.use(cors()); // CORS 설정 추가

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-todo-mongo';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch((error) => {
    console.error('MongoDB 연결 실패:', error);
  });

// 라우트
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Vibe Todo API Server' });
});

// API 라우트
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: '서버 오류가 발생했습니다',
    error: err.message
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
