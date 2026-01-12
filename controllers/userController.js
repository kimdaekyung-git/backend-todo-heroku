const User = require('../models/User');

// 회원가입
exports.registerUser = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        // 필수 필드 확인
        if (!name || !username || !password) {
            return res.status(400).json({
                message: '모든 필드를 입력해주세요',
                required: ['name', 'username', 'password']
            });
        }

        // 중복 username 체크
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: '이미 존재하는 아이디입니다'
            });
        }

        // 새 사용자 생성
        const newUser = new User({
            name,
            username,
            password
        });

        const savedUser = await newUser.save();

        // 응답에서 비밀번호 제외
        const userResponse = {
            _id: savedUser._id,
            name: savedUser.name,
            username: savedUser.username,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        };

        res.status(201).json({
            message: '회원가입이 완료되었습니다',
            user: userResponse
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: '유효성 검사 실패',
                error: error.message
            });
        } else if (error.code === 11000) {
            res.status(409).json({
                message: '이미 존재하는 아이디입니다'
            });
        } else {
            res.status(500).json({
                message: '서버 오류가 발생했습니다',
                error: error.message
            });
        }
    }
};

// 로그인
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 필수 필드 확인
        if (!username || !password) {
            return res.status(400).json({
                message: '아이디와 비밀번호를 입력해주세요'
            });
        }

        // 사용자 찾기
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                message: '존재하지 않는 아이디입니다'
            });
        }

        // 비밀번호 확인
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: '비밀번호가 올바르지 않습니다'
            });
        }

        // 로그인 성공
        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username
        };

        res.status(200).json({
            message: '로그인 성공',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({
            message: '서버 오류가 발생했습니다',
            error: error.message
        });
    }
};