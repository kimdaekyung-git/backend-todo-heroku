const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// GET /api/todos/counts - 월별 할일 개수 조회 (이 라우트가 /:id 보다 위에 있어야 함)
router.get('/counts', todoController.getTodoCounts);

// POST /api/todos - 새 할일 생성
router.post('/', todoController.createTodo);

// GET /api/todos - 모든 할일 조회 (필터링 지원)
router.get('/', todoController.getAllTodos);

// GET /api/todos/:id - 특정 할일 조회
router.get('/:id', todoController.getTodoById);

// PUT /api/todos/:id - 할일 수정
router.put('/:id', todoController.updateTodo);

// DELETE /api/todos/:id - 할일 삭제
router.delete('/:id', todoController.deleteTodo);

// PATCH /api/todos/:id/toggle - 완료 상태 토글
router.patch('/:id/toggle', todoController.toggleComplete);

module.exports = router;