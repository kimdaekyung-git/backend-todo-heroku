# Todo MongoDB 애플리케이션 구현 작업

## 요구사항
- ✅ 할일 저장 (Create)
- ✅ 할일 조회 (Read)
- ✅ 할일 수정 (Update)
- ✅ 할일 삭제 (Delete)
- ✅ 할일 완료 여부 확인
- ✅ MongoDB를 사용한 데이터 저장

## 작업 체크리스트

### 1. 데이터베이스 스키마 설계
- [x] MongoDB 스키마 요구사항 정의
- [x] Mongoose 스키마 모델 설계
- [x] 스키마 파일 생성

### 2. API 엔드포인트 구현
- [x] POST /api/todos - 새 할일 생성
- [x] GET /api/todos - 모든 할일 조회
- [x] GET /api/todos/:id - 특정 할일 조회
- [x] PUT /api/todos/:id - 할일 수정
- [x] DELETE /api/todos/:id - 할일 삭제
- [x] PATCH /api/todos/:id/toggle - 완료 상태 토글

### 3. 라우터 및 컨트롤러 구조화
- [x] routes 폴더 생성 및 라우터 분리
- [x] controllers 폴더 생성 및 비즈니스 로직 분리
- [x] models 폴더 생성 및 스키마 정리

### 4. 검증 및 테스트
- [x] API 엔드포인트 테스트 (Postman/Thunder Client)
- [x] 에러 핸들링 확인
- [x] MongoDB 데이터 저장 확인

### 5. 문서화
- [x] API 문서 작성
- [x] README 업데이트
- [x] 사용 예시 작성
