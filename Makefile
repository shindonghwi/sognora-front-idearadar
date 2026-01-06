.PHONY: help dev build clean swagger update-ui

# Port configuration (update via SETUP.md)
PORT := 3000
CURRENT_VERSION := $(shell node -p "require('./package.json').version")
# swagger TARGET: user (default), admin
TARGET := user

help:
	@echo "Sognora Template v$(CURRENT_VERSION)"
	@echo "Port: $(PORT)"
	@echo ""
	@echo "Server:"
	@echo "  make dev          - 개발 서버 실행"
	@echo ""
	@echo "Build:"
	@echo "  make build        - 프로덕션 빌드"
	@echo ""
	@echo "Swagger:"
	@echo "  make swagger              - 유저 API만 생성 (기본값)"
	@echo "  make swagger TARGET=user  - 유저 API만 생성"
	@echo "  make swagger TARGET=admin - 어드민 API만 생성"
	@echo ""
	@echo "Misc:"
	@echo "  make clean        - 빌드 캐시 정리"
	@echo "  make update-ui    - @sognora/ui 업데이트"

dev:
	@echo "$(PORT) 포트 정리 중..."
	@lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || true
	@echo "이전 빌드 정리 중..."
	@rm -rf .next
	@if [ ! -f env/.env.local ]; then \
		echo "env/.env.local 파일이 없습니다."; \
		exit 1; \
	fi
	@cp env/.env.local .env
	@echo "개발 서버 시작 ($(PORT) 포트)..."
	./node_modules/.bin/next dev -p $(PORT)

build:
	@if [ ! -f env/.env.local ]; then \
		echo "env/.env.local 파일이 없습니다."; \
		exit 1; \
	fi
	@cp env/.env.local .env
	@echo "프로덕션 빌드 중..."
	./node_modules/.bin/next build

clean:
	@echo "빌드 캐시 정리 중..."
	rm -rf .next node_modules/.cache

swagger:
	@BACKEND_PATH="../sognora-backend/docs/swagger/swagger.json"; \
	if [ -f "$$BACKEND_PATH" ]; then \
		if [ "$(TARGET)" = "admin" ]; then \
			echo "🔧 어드민 API만 생성"; \
			./scripts/generate-typescript.sh -f "$$BACKEND_PATH" --only-admin; \
		else \
			echo "🔧 유저 API만 생성"; \
			./scripts/generate-typescript.sh -f "$$BACKEND_PATH" --exclude-admin; \
		fi; \
		echo "React Query hooks 생성 중..."; \
		node scripts/generate-hooks.mjs; \
		echo "✅ 완료!"; \
	else \
		echo "❌ swagger.json 없음: $$BACKEND_PATH"; \
		exit 1; \
	fi

update-ui:
	@echo "@sognora/ui 업데이트 중..."
	@npm update @sognora/ui
	@echo "완료!"
