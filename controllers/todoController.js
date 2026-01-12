const Todo = require('../models/Todo');

// 새 할일 생성
exports.createTodo = async (req, res) => {
    try {
        const { title, content, importance, completed, authorId, authorName, dueDate } = req.body;

        const newTodo = new Todo({
            title,
            content,
            importance,
            completed,
            authorId,
            authorName,
            dueDate: dueDate ? new Date(dueDate) : null
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: '유효성 검사 실패',
                error: error.message
            });
        } else {
            res.status(500).json({
                message: '서버 오류가 발생했습니다',
                error: error.message
            });
        }
    }
};

// 모든 할일 조회 (필터링 지원)
exports.getAllTodos = async (req, res) => {
    try {
        const { authorId, date } = req.query;
        let filter = {};

        // 사용자 필터링
        if (authorId) {
            filter.authorId = authorId;
        }

        // 날짜 필터링
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            filter.dueDate = { $gte: startOfDay, $lte: endOfDay };
        }

        const todos = await Todo.find(filter).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({
            message: '할일 목록을 가져오는데 실패했습니다',
            error: error.message
        });
    }
};

// 월별 할일 개수 조회
exports.getTodoCounts = async (req, res) => {
    try {
        const { authorId, month } = req.query;

        if (!authorId || !month) {
            return res.status(400).json({ message: 'authorId와 month 파라미터가 필요합니다' });
        }

        const [year, monthNum] = month.split('-').map(Number);
        const startOfMonth = new Date(year, monthNum - 1, 1);
        const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

        const todos = await Todo.find({
            authorId: authorId,
            dueDate: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // 날짜별 개수 집계
        const counts = {};
        todos.forEach(todo => {
            if (todo.dueDate) {
                const dateStr = todo.dueDate.toISOString().split('T')[0];
                counts[dateStr] = (counts[dateStr] || 0) + 1;
            }
        });

        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({
            message: '할일 개수를 가져오는데 실패했습니다',
            error: error.message
        });
    }
};

// 특정 ID의 할일 조회
exports.getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: '해당 할일을 찾을 수 없습니다' });
        }

        res.status(200).json(todo);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: '잘못된 ID 형식입니다' });
        }
        res.status(500).json({
            message: '할일을 가져오는데 실패했습니다',
            error: error.message
        });
    }
};

// 할일 수정
exports.updateTodo = async (req, res) => {
    try {
        const { title, content, importance, completed, dueDate } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, content, importance, completed, dueDate },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: '해당 할일을 찾을 수 없습니다' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: '잘못된 ID 형식입니다' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: '유효성 검사 실패',
                error: error.message
            });
        }
        res.status(500).json({
            message: '할일 수정에 실패했습니다',
            error: error.message
        });
    }
};

// 할일 삭제
exports.deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

        if (!deletedTodo) {
            return res.status(404).json({ message: '해당 할일을 찾을 수 없습니다' });
        }

        res.status(200).json({
            message: '할일이 삭제되었습니다',
            deletedTodo
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: '잘못된 ID 형식입니다' });
        }
        res.status(500).json({
            message: '할일 삭제에 실패했습니다',
            error: error.message
        });
    }
};

// 완료 상태 토글
exports.toggleComplete = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: '해당 할일을 찾을 수 없습니다' });
        }

        todo.completed = !todo.completed;
        const updatedTodo = await todo.save();

        res.status(200).json(updatedTodo);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: '잘못된 ID 형식입니다' });
        }
        res.status(500).json({
            message: '완료 상태 변경에 실패했습니다',
            error: error.message
        });
    }
};