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

// 환경변수 확인 (디버깅용 - 비밀번호는 마스킹)
console.log('MONGODB_URI 설정 여부:', process.env.MONGODB_URI ? '환경변수 사용' : '기본값 사용');
console.log('URI 시작부분:', MONGODB_URI.substring(0, 30) + '...');

// MongoDB 연결 옵션
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('MongoDB 연결 성공');
    console.log('연결된 데이터베이스:', mongoose.connection.name);
  })
  .catch((error) => {
    console.error('MongoDB 연결 실패:', error.message);
  });

// 연결 이벤트 리스너
mongoose.connection.on('connected', () => {
  console.log('Mongoose 연결됨');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose 연결 에러:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose 연결 끊김');
});

// 라우트
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Vibe Todo API Server' });
});

// MongoDB 연결 상태 확인 라우트
app.get('/vibe-todo-mongo', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMessages = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const response = {
    dbStatus: statusMessages[dbStatus],
    envVarSet: !!process.env.MONGODB_URI,
    uriPrefix: MONGODB_URI.substring(0, 20) + '...'
  };

  if (dbStatus === 1) {
    res.json({
      status: 'success',
      message: 'MongoDB 연결 성공',
      database: mongoose.connection.name || 'vibe-todo-mongo',
      ...response
    });
  } else {
    res.status(503).json({
      status: 'error',
      message: 'MongoDB 연결 실패',
      ...response
    });
  }
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
