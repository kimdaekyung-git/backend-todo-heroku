# MongoDB Todo 애플리케이션 구현 계획

MongoDB를 사용하여 할일(Todo) 관리 애플리케이션을 구축합니다. CRUD 기능(생성, 조회, 수정, 삭제)과 완료 여부 관리 기능을 제공하는 RESTful API를 개발합니다.

## User Review Required

> [!IMPORTANT]
> 다음 사항을 확인해주세요:
> 1. **MongoDB 연결**: 로컬 MongoDB(`mongodb://localhost:27017`)를 사용할 예정입니다. 다른 연결 URL(예: MongoDB Atlas)을 사용하시나요?
> 2. **프론트엔드 연동**: 나중에 프론트엔드와 연동할 계획이 있나요? 있다면 CORS 설정을 추가하겠습니다.

> [!NOTE]
> **✅ 승인된 사항:**
> - 생성일시(`createdAt`) 및 수정일시(`updatedAt`) 자동 기록 - `timestamps: true` 옵션으로 구현
> - 선택적 마감일(`dueDate`) 필드 추가

---

## Proposed Changes

### Backend Structure

프로젝트를 MVC 패턴으로 구조화하여 유지보수성을 높입니다.

#### [NEW] [Todo.js](file:///c:/workspace/noona/260110-todo-mongoDB/models/Todo.js)

**MongoDB 스키마 정의:**

```javascript
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 입력해주세요'],
    trim: true,
    maxlength: [100, '제목은 100자를 초과할 수 없습니다']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, '설명은 500자를 초과할 수 없습니다']
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null  // 선택적 마감일
  }
}, {
  timestamps: true  // createdAt(생성일시), updatedAt(수정일시) 자동 생성
});

module.exports = mongoose.model('Todo', todoSchema);
```

**스키마 설계 근거:**
- `title`: 필수 필드, 공백 제거(trim), 최대 100자 제한
- `description`: 선택 필드, 상세 설명을 위한 500자 제한
- `completed`: 완료 여부, 기본값 false
- `dueDate`: 선택적 마감일 필드
- **`timestamps: true`**: Mongoose가 자동으로 **생성일시(`createdAt`)** 및 **수정일시(`updatedAt`)** 필드를 추가하고 관리합니다
  - `createdAt`: Todo가 처음 생성된 날짜와 시간 (자동 기록)
  - `updatedAt`: Todo가 마지막으로 수정된 날짜와 시간 (자동 업데이트)
- 유효성 검사(validation)를 스키마 레벨에서 처리하여 데이터 무결성 보장

---

#### [NEW] [todoController.js](file:///c:/workspace/noona/260110-todo-mongoDB/controllers/todoController.js)

**비즈니스 로직 처리:**

모든 CRUD 작업을 처리하는 컨트롤러 함수들을 정의합니다:

1. `createTodo` - 새 할일 생성
2. `getAllTodos` - 모든 할일 조회 (최신순 정렬)
3. `getTodoById` - 특정 ID의 할일 조회
4. `updateTodo` - 할일 정보 수정
5. `deleteTodo` - 할일 삭제
6. `toggleComplete` - 완료 상태 토글

각 함수는:
- Try-catch로 에러 핸들링
- 적절한 HTTP 상태 코드 반환 (200, 201, 404, 500)
- 존재하지 않는 ID에 대한 404 처리
- 잘못된 ID 형식에 대한 에러 처리

---

#### [NEW] [todoRoutes.js](file:///c:/workspace/noona/260110-todo-mongoDB/routes/todoRoutes.js)

**API 라우트 정의:**

| Method | Endpoint | 기능 | Controller |
|--------|----------|------|------------|
| POST | `/api/todos` | 할일 생성 | createTodo |
| GET | `/api/todos` | 모든 할일 조회 | getAllTodos |
| GET | `/api/todos/:id` | 특정 할일 조회 | getTodoById |
| PUT | `/api/todos/:id` | 할일 수정 | updateTodo |
| DELETE | `/api/todos/:id` | 할일 삭제 | deleteTodo |
| PATCH | `/api/todos/:id/toggle` | 완료 상태 토글 | toggleComplete |

---

#### [MODIFY] [index.js](file:///c:/workspace/noona/260110-todo-mongoDB/index.js)

**변경 사항:**
1. Todo 라우터 import 및 등록
2. 에러 핸들링 미들웨어 추가
3. 몽고DB 연결 에러 처리 개선
4. CORS 설정 추가 (프론트엔드 연동 대비)

---

## Verification Plan

### Automated Tests

API 엔드포인트를 REST Client 도구를 사용하여 테스트합니다.

#### 1. 서버 실행

```bash
npm run dev
```

예상 출력:
```
서버가 포트 5000에서 실행 중입니다.
MongoDB 연결 성공
```

#### 2. API 테스트 (VS Code REST Client 또는 Postman)

아래 테스트 케이스들을 순차적으로 실행하여 검증합니다:

**테스트 1: 할일 생성 (POST)**
```http
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "MongoDB 스키마 학습하기",
  "description": "Mongoose를 사용한 스키마 정의 방법 익히기",
  "dueDate": "2026-01-15T23:59:59.999Z"
}
```
예상 응답: `201 Created` + 생성된 Todo 객체
```json
{
  "_id": "...",
  "title": "MongoDB 스키마 학습하기",
  "description": "Mongoose를 사용한 스키마 정의 방법 익히기",
  "completed": false,
  "dueDate": "2026-01-15T23:59:59.999Z",
  "createdAt": "2026-01-10T04:29:15.123Z",  // 자동 생성
  "updatedAt": "2026-01-10T04:29:15.123Z",  // 자동 생성
  "__v": 0
}
```

**테스트 2: 모든 할일 조회 (GET)**
```http
GET http://localhost:5000/api/todos
```
예상 응답: `200 OK` + 배열 형태의 Todo 목록

**테스트 3: 특정 할일 조회 (GET)**
```http
GET http://localhost:5000/api/todos/{id}
```
예상 응답: `200 OK` + 해당 Todo 객체

**테스트 4: 할일 수정 (PUT)**
```http
PUT http://localhost:5000/api/todos/{id}
Content-Type: application/json

{
  "title": "MongoDB 스키마 마스터하기",
  "completed": true
}
```
예상 응답: `200 OK` + 수정된 Todo 객체

**테스트 5: 완료 상태 토글 (PATCH)**
```http
PATCH http://localhost:5000/api/todos/{id}/toggle
```
예상 응답: `200 OK` + completed 값이 반전된 Todo 객체

**테스트 6: 할일 삭제 (DELETE)**
```http
DELETE http://localhost:5000/api/todos/{id}
```
예상 응답: `200 OK` + 성공 메시지

**테스트 7: 존재하지 않는 ID 조회**
```http
GET http://localhost:5000/api/todos/000000000000000000000000
```
예상 응답: `404 Not Found`

---

### Manual Verification

#### MongoDB 데이터 확인

1. MongoDB Compass 실행
2. `mongodb://localhost:27017` 연결
3. `vibe-todo-mongo` 데이터베이스 선택
4. `todos` 컬렉션 확인
5. 저장된 문서들이 스키마에 맞게 저장되었는지 확인:
   - `title`, `description`, `completed`, `dueDate` 필드 존재
   - **`createdAt`, `updatedAt` 자동 생성 확인** (생성일시 및 수정일시)
   - 데이터 타입 일치 (title: String, completed: Boolean, createdAt/updatedAt/dueDate: Date)

#### 에러 처리 확인

잘못된 요청에 대한 에러 응답을 확인합니다:

1. **제목 없이 생성 시도:**
   ```http
   POST http://localhost:5000/api/todos
   Content-Type: application/json

   {
     "description": "제목 없음"
   }
   ```
   예상: `400 Bad Request` + 에러 메시지

2. **잘못된 ID 형식:**
   ```http
   GET http://localhost:5000/api/todos/invalid-id
   ```
   예상: `500 Internal Server Error` 또는 적절한 에러 응답

---

## 다음 단계

구현 완료 후 다음과 같은 개선을 고려할 수 있습니다:

1. **유효성 검사 강화**: express-validator 추가
2. **페이징**: 할일 목록이 많을 때 페이지네이션
3. **검색/필터링**: 제목으로 검색, 완료 여부로 필터링
4. **프론트엔드 개발**: React 또는 Vanilla JS로 UI 구현
5. **배포**: MongoDB Atlas + Heroku/Vercel 배포

위 계획에 동의하시면 단계별로 구현을 시작하겠습니다! 🚀
