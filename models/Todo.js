const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
title: {
type: String,
required: [true, '제목을 입력해주세요'],
trim: true,
maxlength: [100, '제목은 100자를 초과할 수 없습니다']
},
content: {
type: String,
trim: true,
maxlength: [500, '내용은 500자를 초과할 수 없습니다']
},
importance: {
type: Number,
default: 1,
min: 1,
max: 3
},
completed: {
type: Boolean,
default: false
},
authorId: {
type: String,
default: null
},
authorName: {
type: String,
default: '익명'
},
dueDate: {
type: Date,
default: null
}
}, {
timestamps: true  // createdAt(생성일시), updatedAt(수정일시) 자동 생성
});

module.exports = mongoose.model('Todo', todoSchema);
