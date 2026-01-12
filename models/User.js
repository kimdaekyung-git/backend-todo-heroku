const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '이름을 입력해주세요'],
        trim: true,
        maxlength: [50, '이름은 50자를 초과할 수 없습니다']
    },
    username: {
        type: String,
        required: [true, '아이디를 입력해주세요'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, '아이디는 최소 3자 이상이어야 합니다'],
        maxlength: [30, '아이디는 30자를 초과할 수 없습니다']
    },
    password: {
        type: String,
        required: [true, '비밀번호를 입력해주세요'],
        minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다']
    }
}, {
    timestamps: true
});

// 비밀번호 저장 전 암호화 (Mongoose 9.x 호환)
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);