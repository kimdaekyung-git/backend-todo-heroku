# Vibe Todo MongoDB

MongoDB를 사용하는 Todo 애플리케이션 REST API 서버입니다.

## 기능

- ✅ 할일 생성 (Create)
- ✅ 할일 조회 (Read)
- ✅ 할일 수정 (Update)
- ✅ 할일 삭제 (Delete)
- ✅ 할일 완료 여부 토글
- ✅ 생성일시 및 수정일시 자동 기록
- ✅ 선택적 마감일 설정

## 기술 스택

- **Node.js** (v18+)
- **Express.js** - 웹 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-Origin Resource Sharing

## 프로젝트 구조

```
vibe-todo-mongo/
├── controllers/          # 비즈니스 로직
│   └── todoController.js
├── models/              # Mongoose 스키마
│   └── Todo.js
├── routes/              # API 라우트
│   └── todoRoutes.js
├── docs/                # 문서
│   ├── implementation_plan.md
│   └── task.md
├── index.js             # 메인 서버 파일
├── test-api.http        # API 테스트 파일
└── package.json
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. MongoDB 실행

로컬 MongoDB를 실행하세요:

```bash
# Windows에서 MongoDB 서비스 시작
net start MongoDB

# 또는 MongoDB Compass를 실행하여 연결 확인
```

### 3. 서버 실행

**개발 모드 (watch mode):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

서버가 성공적으로 시작되면:
```
서버가 포트 5000에서 실행 중입니다.
MongoDB 연결 성공
```

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/todos` | 새 할일 생성 |
| GET | `/api/todos` | 모든 할일 조회 |
| GET | `/api/todos/:id` | 특정 할일 조회 |
| PUT | `/api/todos/:id` | 할일 수정 |
| DELETE | `/api/todos/:id` | 할일 삭제 |
| PATCH | `/api/todos/:id/toggle` | 완료 상태 토글 |

## 데이터 스키마

### Todo 모델

```javascript
{
  title: String,        // 필수, 최대 100자
  description: String,  // 선택, 최대 500자
  completed: Boolean,   // 기본값: false
  dueDate: Date,        // 선택적 마감일
  createdAt: Date,      // 자동 생성
  updatedAt: Date       // 자동 업데이트
}
```

## API 사용 예시

### 1. 할일 생성

```bash
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "MongoDB 학습하기",
  "description": "Mongoose 스키마 정의",
  "dueDate": "2026-01-15T23:59:59.999Z"
}
```

**응답:**
```json
{
  "_id": "679fb123456789abcdef0123",
  "title": "MongoDB 학습하기",
  "description": "Mongoose 스키마 정의",
  "completed": false,
  "dueDate": "2026-01-15T23:59:59.999Z",
  "createdAt": "2026-01-10T04:35:00.000Z",
  "updatedAt": "2026-01-10T04:35:00.000Z",
  "__v": 0
}
```

### 2. 모든 할일 조회

```bash
GET http://localhost:5000/api/todos
```

### 3. 할일 수정

```bash
PUT http://localhost:5000/api/todos/679fb123456789abcdef0123
Content-Type: application/json

{
  "title": "MongoDB 마스터하기",
  "completed": true
}
```

### 4. 완료 상태 토글

```bash
PATCH http://localhost:5000/api/todos/679fb123456789abcdef0123/toggle
```

### 5. 할일 삭제

```bash
DELETE http://localhost:5000/api/todos/679fb123456789abcdef0123
```

## 테스트

VS Code에서 REST Client 확장 프로그램을 설치하고 `test-api.http` 파일을 사용하여 API를 테스트할 수 있습니다.

1. VS Code에서 `humao.rest-client` 확장 프로그램 설치
2. `test-api.http` 파일 열기
3. 각 요청 위의 "Send Request" 클릭

## MongoDB 데이터 확인

MongoDB Compass를 사용하여 데이터를 확인할 수 있습니다:

1. MongoDB Compass 실행
2. `mongodb://localhost:27017` 연결
3. `vibe-todo-mongo` 데이터베이스 선택
4. `todos` 컬렉션 확인

## 환경 변수

기본 MongoDB URI: `mongodb://localhost:27017/vibe-todo-mongo`

다른 URI를 사용하려면 환경 변수를 설정하세요:

```bash
# Windows PowerShell
$env:MONGODB_URI="mongodb://your-connection-string"
npm start
```

## 에러 처리

API는 다음과 같은 에러를 처리합니다:

- **400 Bad Request**: 유효성 검사 실패 (예: 제목 없음)
- **404 Not Found**: 존재하지 않는 할일 ID
- **500 Internal Server Error**: 서버 오류

## 추가 개선 사항

- [ ] 입력 유효성 검사 강화 (express-validator)
- [ ] 페이징 및 정렬 기능
- [ ] 검색 및 필터링
- [ ] 프론트엔드 UI 개발
- [ ] 배포 (MongoDB Atlas + Heroku/Vercel)

## 라이선스

Private
