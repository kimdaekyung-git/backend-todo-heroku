# Todo MongoDB 애플리케이션 구현 완료

MongoDB를 사용하는 Todo 관리 REST API 서버를 성공적으로 구현했습니다.

## 구현된 기능

✅ **CRUD 작업**
- 할일 생성 (Create)
- 할일 조회 (Read - 전체/개별)
- 할일 수정 (Update)
- 할일 삭제 (Delete)
- 완료 상태 토글

✅ **자동 필드 관리**
- `createdAt`: 생성일시 자동 기록
- `updatedAt`: 수정일시 자동 업데이트

✅ **추가 기능**
- 선택적 마감일(`dueDate`) 설정
- 유효성 검사 (제목 필수, 최대 길이 제한)
- 에러 핸들링 (400, 404, 500)
- CORS 설정 (프론트엔드 연동 대비)

---

## 프로젝트 구조

```
vibe-todo-mongo/
├── models/
│   └── Todo.js              # Mongoose 스키마
├── controllers/
│   └── todoController.js    # 비즈니스 로직
├── routes/
│   └── todoRoutes.js        # API 라우트
├── docs/
│   ├── implementation_plan.md
│   └── task.md
├── index.js                 # 메인 서버
├── test-api.http            # API 테스트 파일
├── README.md
└── package.json
```

### MVC 패턴 적용

**Model**: [`models/Todo.js`](file:///c:/workspace/noona/260110-todo-mongoDB/models/Todo.js)
- Mongoose 스키마 정의
- 데이터 유효성 검사
- timestamps 옵션으로 생성일시/수정일시 자동 관리

**Controller**: [`controllers/todoController.js`](file:///c:/workspace/noona/260110-todo-mongoDB/controllers/todoController.js)
- 6개의 컨트롤러 함수 (createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo, toggleComplete)
- try-catch를 통한 에러 핸들링
- 적절한 HTTP 상태 코드 반환

**Router**: [`routes/todoRoutes.js`](file:///c:/workspace/noona/260110-todo-mongoDB/routes/todoRoutes.js)
- RESTful API 엔드포인트 정의
- 컨트롤러 함수와 라우트 연결

---

## 구현된 파일

### 1. MongoDB 스키마 - [Todo.js](file:///c:/workspace/noona/260110-todo-mongoDB/models/Todo.js)

```javascript
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 입력해주세요'],
    trim: true,
    maxlength: [100, '제목은 100자를 초과할 수 없습니다']
  },
  description: String,
  completed: Boolean (기본값: false),
  dueDate: Date (선택)
}, {
  timestamps: true  // createdAt, updatedAt 자동 생성
});
```

**스키마 특징:**
- 제목 필수 입력 및 유효성 검사
- timestamps 옵션으로 생성일시/수정일시 자동 관리
- 공백 자동 제거(trim) 및 길이 제한

### 2. API 엔드포인트

| Method | Endpoint | 기능 |
|--------|----------|------|
| POST | `/api/todos` | 할일 생성 |
| GET | `/api/todos` | 모든 할일 조회 (최신순) |
| GET | `/api/todos/:id` | 특정 할일 조회 |
| PUT | `/api/todos/:id` | 할일 수정 |
| DELETE | `/api/todos/:id` | 할일 삭제 |
| PATCH | `/api/todos/:id/toggle` | 완료 상태 토글 |

### 3. 메인 서버 - [index.js](file:///c:/workspace/noona/260110-todo-mongoDB/index.js)

**추가된 기능:**
- Express 및 Mongoose 설정
- CORS 미들웨어 (프론트엔드 연동 대비)
- Todo 라우터 연결 (`/api/todos`)
- 에러 핸들링 미들웨어
- MongoDB 연결 (`mongodb://localhost:27017/vibe-todo-mongo`)

---

## 서버 실행 결과

✅ **서버가 성공적으로 실행되었습니다!**

```
서버가 포트 5000에서 실행 중입니다.
MongoDB 연결 성공
```

**실행 명령어:**
```bash
# 개발 모드 (watch mode)
npm run dev

# 프로덕션 모드
npm start
```

---

## API 테스트 방법

### 옵션 1: REST Client (VS Code)

1. VS Code에서 `humao.rest-client` 확장 프로그램 설치
2. [`test-api.http`](file:///c:/workspace/noona/260110-todo-mongoDB/test-api.http) 파일 열기
3. 각 요청 위의 "Send Request" 클릭

### 옵션 2: cURL

```bash
# 할일 생성
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"MongoDB 학습하기\",\"description\":\"Mongoose 스키마 정의\"}"

# 모든 할일 조회
curl http://localhost:5000/api/todos

# 특정 할일 조회
curl http://localhost:5000/api/todos/{id}
```

### 옵션 3: Postman

Postman을 사용하여 각 엔드포인트를 테스트할 수 있습니다.

---

## 테스트 시나리오 예시

### 1. 할일 생성 테스트

**요청:**
```http
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "MongoDB 스키마 학습하기",
  "description": "Mongoose를 사용한 스키마 정의 방법 익히기",
  "dueDate": "2026-01-15T23:59:59.999Z"
}
```

**예상 응답:** (201 Created)
```json
{
  "_id": "679fb123456789abcdef0123",
  "title": "MongoDB 스키마 학습하기",
  "description": "Mongoose를 사용한 스키마 정의 방법 익히기",
  "completed": false,
  "dueDate": "2026-01-15T23:59:59.999Z",
  "createdAt": "2026-01-10T04:35:00.000Z",  // 자동 생성
  "updatedAt": "2026-01-10T04:35:00.000Z",  // 자동 생성
  "__v": 0
}
```

### 2. 모든 할일 조회

**요청:**
```http
GET http://localhost:5000/api/todos
```

**예상 응답:** (200 OK)
```json
[
  {
    "_id": "679fb123456789abcdef0123",
    "title": "MongoDB 스키마 학습하기",
    "completed": false,
    "createdAt": "2026-01-10T04:35:00.000Z",
    "updatedAt": "2026-01-10T04:35:00.000Z"
  }
]
```

### 3. 완료 상태 토글

**요청:**
```http
PATCH http://localhost:5000/api/todos/679fb123456789abcdef0123/toggle
```

**결과:** `completed` 필드가 `true`로 변경되고 `updatedAt`이 자동 업데이트됩니다.

---

## MongoDB 데이터 확인

**MongoDB Compass 사용:**

1. MongoDB Compass 실행
2. `mongodb://localhost:27017` 연결
3. `vibe-todo-mongo` 데이터베이스 선택
4. `todos` 컬렉션 확인

**확인 사항:**
- [x] `title`, `description`, `completed`, `dueDate` 필드 존재
- [x] `createdAt`, `updatedAt` 자동 생성 확인
- [x] 데이터 타입 일치 (String, Boolean, Date)

---

## 에러 처리 검증

### 1. 유효성 검사 에러 (400)

**제목 없이 생성 시도:**
```http
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "description": "제목 없음"
}
```

**응답:** (400 Bad Request)
```json
{
  "message": "유효성 검사 실패",
  "error": "Todo validation failed: title: 제목을 입력해주세요"
}
```

### 2. Not Found 에러 (404)

**존재하지 않는 ID 조회:**
```http
GET http://localhost:5000/api/todos/000000000000000000000000
```

**응답:** (404 Not Found)
```json
{
  "message": "해당 할일을 찾을 수 없습니다"
}
```

### 3. 잘못된 ID 형식

**응답:** (404)
```json
{
  "message": "잘못된 ID 형식입니다"
}
```

---

## 다음 단계

구현이 완료되었으며, 다음과 같은 개선 사항을 고려할 수 있습니다:

### 백엔드 개선
- [ ] express-validator를 사용한 입력 유효성 검사 강화
- [ ] 페이징 및 정렬 기능 (예: `?page=1&limit=10&sort=-createdAt`)
- [ ] 검색 및 필터링 (예: `?completed=true&search=mongodb`)
- [ ] 우선순위, 카테고리 필드 추가

### 프론트엔드 개발
- [ ] React 또는 Vanilla JS로 UI 구현
- [ ] 할일 목록 표시
- [ ] 생성/수정/삭제 폼
- [ ] 완료 체크박스
- [ ] 마감일 표시

### 배포
- [ ] MongoDB Atlas (클라우드 DB)
- [ ] Heroku 또는 Vercel (서버)
- [ ] 환경 변수 설정

---

## 요약

✅ **MongoDB Todo 애플리케이션을 성공적으로 구현했습니다!**

**주요 성과:**
1. MVC 패턴으로 프로젝트 구조화
2. Mongoose로 MongoDB 스키마 정의
3. RESTful API 6개 엔드포인트 구현
4. 생성일시/수정일시 자동 기록 (timestamps)
5. 유효성 검사 및 에러 핸들링
6. CORS 설정 완료
7. 서버 실행 및 MongoDB 연결 성공
8. API 테스트 파일 및 문서 작성

**다음 작업:** 
- [`test-api.http`](file:///c:/workspace/noona/260110-todo-mongoDB/test-api.http) 파일로 API 테스트 시작
- MongoDB Compass로 데이터 확인
- 필요시 프론트엔드 개발 시작

모든 구현이 완료되었으며, API를 바로 사용할 수 있습니다! 🎉
