#!/bin/bash

# TypeScript 클라이언트 SDK 자동 생성
# Clean Architecture에 맞춰 생성된 타입과 API를 적절한 위치에 배치
# 백엔드의 로컬 swagger.json 파일 사용 (Swagger 2.0)

set -e

# 환경 설정
TEMP_DIR="./temp_sdk"
# 새로운 아키텍처 디렉토리 설정 (generated/ 하위로 이동)
API_CLIENTS_DIR="./src/core/api/generated/clients"
API_DTO_DIR="./src/core/api/generated/dto"
API_RO_DIR="./src/core/api/generated/ro"
API_TYPES_DIR="./src/core/api/generated/types"
SWAGGER_DIR="./temp_swagger"
SWAGGER_FILE="$SWAGGER_DIR/swagger.json"

# 사용법 출력 함수
show_usage() {
    echo "사용법: $0 [OPTIONS]"
    echo ""
    echo "옵션:"
    echo "  -f, --file PATH      로컬 swagger.json 파일 경로 [필수]"
    echo "  --exclude-admin      관리자 API 제외 (유저용 API만 생성)"
    echo "  --only-admin         관리자 API만 생성 (유저용 API 제외)"
    echo "  -h, --help           도움말 출력"
    echo ""
    echo "예시:"
    echo "  $0 -f /path/to/swagger.json --exclude-admin  # 유저용 API만"
    echo "  $0 -f /path/to/swagger.json --only-admin     # 어드민 API만"
    echo "  make swagger              # 유저용 API만 (기본값)"
    echo "  make swagger TARGET=admin # 어드민 API만"
    exit 0
}

# 인자 파싱
LOCAL_SWAGGER_FILE=""
EXCLUDE_ADMIN=false
ONLY_ADMIN=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--file)
            LOCAL_SWAGGER_FILE="$2"
            shift 2
            ;;
        --exclude-admin)
            EXCLUDE_ADMIN=true
            shift
            ;;
        --only-admin)
            ONLY_ADMIN=true
            shift
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            echo "❌ 알 수 없는 옵션: $1"
            show_usage
            ;;
    esac
done

# 상호 배타적 옵션 검증
if [ "$EXCLUDE_ADMIN" = true ] && [ "$ONLY_ADMIN" = true ]; then
    echo "❌ --exclude-admin과 --only-admin은 동시에 사용할 수 없습니다"
    exit 1
fi

# 파일 경로 확인
if [[ -z "$LOCAL_SWAGGER_FILE" ]]; then
    echo "❌ swagger.json 파일 경로가 필요합니다"
    echo ""
    show_usage
fi

# 파일 존재 여부 확인
if [[ ! -f "$LOCAL_SWAGGER_FILE" ]]; then
    echo "❌ Swagger 파일을 찾을 수 없습니다: $LOCAL_SWAGGER_FILE"
    exit 1
fi

echo "🚀 TypeScript SDK 생성 시작..."
echo "📍 로컬 파일 사용: $LOCAL_SWAGGER_FILE"

# OpenAPI Generator 설치 확인
if ! command -v openapi-generator-cli &> /dev/null; then
    echo "📦 OpenAPI Generator 설치 중..."
    npm install -g @openapitools/openapi-generator-cli
fi

# 임시 파일 정리 (생성된 파일은 유지)
echo "🧹 임시 파일 정리 중..."
rm -rf "$TEMP_DIR"
rm -rf "$SWAGGER_DIR"
rm -f temp_swagger.json

# 생성된 타입스크립트 파일만 정리
echo "🗑️  기존 생성된 TypeScript 파일 정리 중..."
if [ -d "$API_CLIENTS_DIR" ]; then
    find "$API_CLIENTS_DIR" -name "*.ts" -not -name "index.ts" -delete
fi
if [ -d "$API_DTO_DIR" ]; then
    find "$API_DTO_DIR" -name "*.ts" -not -name "index.ts" -delete
fi
if [ -d "$API_RO_DIR" ]; then
    find "$API_RO_DIR" -name "*.ts" -not -name "index.ts" -delete
fi
if [ -d "$API_TYPES_DIR" ]; then
    find "$API_TYPES_DIR" -name "*.ts" -not -name "index.ts" -delete
fi

# 필요한 디렉토리 생성
if ! mkdir -p "$SWAGGER_DIR" "$API_CLIENTS_DIR" "$API_DTO_DIR" "$API_RO_DIR" "$API_TYPES_DIR"; then
    echo "❌ 디렉토리 생성 실패"
    exit 1
fi

# Swagger JSON 복사
echo "📥 로컬 Swagger JSON 복사 중..."
if ! cp "$LOCAL_SWAGGER_FILE" "$SWAGGER_FILE"; then
    echo "❌ Swagger JSON 복사 실패: $LOCAL_SWAGGER_FILE"
    rm -rf "$SWAGGER_DIR"
    exit 1
fi

# Admin API 필터링 (--exclude-admin 옵션이 있을 경우)
if [ "$EXCLUDE_ADMIN" = true ]; then
    echo "🎯 관리자 API 제외 중..."

    # Node.js를 사용하여 JSON 필터링
    node -e "
    const fs = require('fs');
    const swagger = JSON.parse(fs.readFileSync('$SWAGGER_FILE', 'utf-8'));

    // Admin 태그 제거
    if (swagger.tags) {
        swagger.tags = swagger.tags.filter(tag => {
            const tagName = tag.name.toLowerCase();
            return !tagName.startsWith('admin') && !tagName.includes('admin');
        });
    }

    // Admin 엔드포인트 제거
    if (swagger.paths) {
        const filteredPaths = {};
        for (const [path, methods] of Object.entries(swagger.paths)) {
            // /admin으로 시작하는 경로 제외
            if (path.toLowerCase().includes('/admin')) {
                continue;
            }

            // 각 메서드의 태그 확인
            const filteredMethods = {};
            for (const [method, details] of Object.entries(methods)) {
                if (details.tags) {
                    const hasAdminTag = details.tags.some(tag =>
                        tag.toLowerCase().startsWith('admin') || tag.toLowerCase().includes('admin')
                    );
                    if (!hasAdminTag) {
                        filteredMethods[method] = details;
                    }
                } else {
                    filteredMethods[method] = details;
                }
            }

            if (Object.keys(filteredMethods).length > 0) {
                filteredPaths[path] = filteredMethods;
            }
        }
        swagger.paths = filteredPaths;
    }

    // 사용되지 않는 스키마 제거
    // paths에서 참조되는 스키마만 수집
    const usedSchemas = new Set();

    function collectRefs(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
            obj.forEach(collectRefs);
            return;
        }
        for (const [key, value] of Object.entries(obj)) {
            if (key === '\$ref' && typeof value === 'string') {
                // Swagger 2.0: #/definitions/SomeName
                // OpenAPI 3.0: #/components/schemas/SomeName
                let match = value.match(/#\\/definitions\\/(.+)/);
                if (!match) {
                    match = value.match(/#\\/components\\/schemas\\/(.+)/);
                }
                if (match) {
                    usedSchemas.add(match[1]);
                }
            } else {
                collectRefs(value);
            }
        }
    }

    // paths에서 참조 수집
    collectRefs(swagger.paths);

    // Swagger 2.0은 definitions, OpenAPI 3.0은 components.schemas
    const schemas = swagger.definitions || (swagger.components && swagger.components.schemas) || {};
    const totalSchemas = Object.keys(schemas).length;

    // 스키마 간 참조도 재귀적으로 수집 (의존성 체인)
    let prevSize = 0;
    while (prevSize !== usedSchemas.size) {
        prevSize = usedSchemas.size;
        for (const schemaName of [...usedSchemas]) {
            const schema = schemas[schemaName];
            if (schema) {
                collectRefs(schema);
            }
        }
    }

    // 사용되지 않는 스키마 제거
    const filteredSchemas = {};
    for (const [name, schema] of Object.entries(schemas)) {
        if (usedSchemas.has(name)) {
            filteredSchemas[name] = schema;
        }
    }

    // Swagger 버전에 따라 적절한 위치에 저장
    if (swagger.definitions) {
        swagger.definitions = filteredSchemas;
    } else if (swagger.components && swagger.components.schemas) {
        swagger.components.schemas = filteredSchemas;
    }

    const removedCount = totalSchemas - Object.keys(filteredSchemas).length;
    console.log('  📊 스키마 필터링: ' + Object.keys(filteredSchemas).length + '개 유지, ' + removedCount + '개 제거');

    fs.writeFileSync('$SWAGGER_FILE', JSON.stringify(swagger, null, 2));
    "

    echo "✅ 관리자 API 및 미사용 스키마 제외 완료"
fi

# Admin API만 유지 (--only-admin 옵션이 있을 경우)
if [ "$ONLY_ADMIN" = true ]; then
    echo "🎯 관리자 API만 유지 중..."

    # Node.js를 사용하여 JSON 필터링
    node -e "
    const fs = require('fs');
    const swagger = JSON.parse(fs.readFileSync('$SWAGGER_FILE', 'utf-8'));

    // Admin 태그만 유지
    if (swagger.tags) {
        swagger.tags = swagger.tags.filter(tag => {
            const tagName = tag.name.toLowerCase();
            return tagName.startsWith('admin') || tagName.includes('admin');
        });
    }

    // Admin 엔드포인트만 유지
    if (swagger.paths) {
        const filteredPaths = {};
        for (const [path, methods] of Object.entries(swagger.paths)) {
            // /admin으로 시작하는 경로만 유지
            if (!path.toLowerCase().includes('/admin')) {
                continue;
            }

            // 각 메서드의 태그 확인
            const filteredMethods = {};
            for (const [method, details] of Object.entries(methods)) {
                if (details.tags) {
                    const hasAdminTag = details.tags.some(tag =>
                        tag.toLowerCase().startsWith('admin') || tag.toLowerCase().includes('admin')
                    );
                    if (hasAdminTag) {
                        filteredMethods[method] = details;
                    }
                }
            }

            if (Object.keys(filteredMethods).length > 0) {
                filteredPaths[path] = filteredMethods;
            }
        }
        swagger.paths = filteredPaths;
    }

    // 사용되지 않는 스키마 제거
    const usedSchemas = new Set();

    function collectRefs(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
            obj.forEach(collectRefs);
            return;
        }
        for (const [key, value] of Object.entries(obj)) {
            if (key === '\$ref' && typeof value === 'string') {
                let match = value.match(/#\\/definitions\\/(.+)/);
                if (!match) {
                    match = value.match(/#\\/components\\/schemas\\/(.+)/);
                }
                if (match) {
                    usedSchemas.add(match[1]);
                }
            } else {
                collectRefs(value);
            }
        }
    }

    collectRefs(swagger.paths);

    const schemas = swagger.definitions || (swagger.components && swagger.components.schemas) || {};
    const totalSchemas = Object.keys(schemas).length;

    let prevSize = 0;
    while (prevSize !== usedSchemas.size) {
        prevSize = usedSchemas.size;
        for (const schemaName of [...usedSchemas]) {
            const schema = schemas[schemaName];
            if (schema) {
                collectRefs(schema);
            }
        }
    }

    const filteredSchemas = {};
    for (const [name, schema] of Object.entries(schemas)) {
        if (usedSchemas.has(name)) {
            filteredSchemas[name] = schema;
        }
    }

    if (swagger.definitions) {
        swagger.definitions = filteredSchemas;
    } else if (swagger.components && swagger.components.schemas) {
        swagger.components.schemas = filteredSchemas;
    }

    const removedCount = totalSchemas - Object.keys(filteredSchemas).length;
    console.log('  📊 스키마 필터링: ' + Object.keys(filteredSchemas).length + '개 유지, ' + removedCount + '개 제거');

    fs.writeFileSync('$SWAGGER_FILE', JSON.stringify(swagger, null, 2));
    "

    echo "✅ 유저 API 제외, 관리자 API만 유지 완료"
fi

# Swagger JSON 검증
if ! jq empty "$SWAGGER_FILE" 2>/dev/null; then
    echo "❌ 유효하지 않은 JSON 파일입니다"
    rm -rf "$SWAGGER_DIR"
    exit 1
fi

echo "✅ Swagger JSON 준비 완료"

# SDK 생성 (임시 폴더에)
echo "📝 SDK 생성 중..."
if ! npx @openapitools/openapi-generator-cli generate \
    -i "$SWAGGER_FILE" \
    -g typescript-axios \
    -o "$TEMP_DIR" \
    --skip-validate-spec \
    --global-property=models,apis,supportingFiles \
    --additional-properties=supportsES6=true,withInterfaces=true,modelPropertyNaming=camelCase,withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models \
    --verbose; then
    echo "❌ SDK 생성 실패"
    rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
    exit 1
fi

# 생성된 파일을 새 구조에 맞게 이동
echo "📂 파일을 적절한 위치에 배치 중..."

if [ -d "$TEMP_DIR" ]; then
    # 기반 파일들 먼저 복사 (base, common, configuration 등)
    if [ ! -f "$TEMP_DIR/base.ts" ] || [ ! -f "$TEMP_DIR/common.ts" ] || [ ! -f "$TEMP_DIR/configuration.ts" ]; then
        echo "❌ 필수 기반 파일이 생성되지 않았습니다"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi
    if ! cp "$TEMP_DIR/base.ts" "$API_CLIENTS_DIR/"; then
        echo "❌ 기반 파일 복사 실패: base.ts"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi
    if ! cp "$TEMP_DIR/common.ts" "$API_CLIENTS_DIR/"; then
        echo "❌ 기반 파일 복사 실패: common.ts"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi
    if ! cp "$TEMP_DIR/configuration.ts" "$API_CLIENTS_DIR/"; then
        echo "❌ 기반 파일 복사 실패: configuration.ts"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi
    echo "  ✅ 기반 파일들 (base, common, configuration) -> $API_CLIENTS_DIR"

    # API 클라이언트 파일들 (api 폴더의 *-api.ts 파일들)
    if [ ! -d "$TEMP_DIR/api" ]; then
        echo "❌ API 클라이언트 파일이 생성되지 않았습니다"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi

    # 파일 복사하면서 하이픈을 언더바로 변경
    # API 파일 존재 여부 먼저 확인
    api_files=$(find "$TEMP_DIR/api" -name "*-api.ts" -type f)
    if [ -z "$api_files" ]; then
        echo "❌ API 클라이언트 파일이 하나도 생성되지 않았습니다"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi

    # 파일 복사
    echo "$api_files" | while read -r api_file; do
        original_name=$(basename "$api_file")
        new_name=$(echo "$original_name" | tr '-' '_')
        if ! cp "$api_file" "$API_CLIENTS_DIR/$new_name"; then
            echo "❌ API 클라이언트 파일 복사 실패: $original_name"
            rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
            exit 1
        fi
    done

    # import 경로 수정: ../configuration -> ./configuration
    if ! find "$API_CLIENTS_DIR" -name "*_api.ts" -type f -exec sed -i '' "s|from '../configuration'|from './configuration'|g" {} \;; then
        echo "❌ import 경로 수정 실패: configuration"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi
    if ! find "$API_CLIENTS_DIR" -name "*_api.ts" -type f -exec sed -i '' "s|from '../common'|from './common'|g" {} \;; then
        echo "❌ import 경로 수정 실패: common"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi
    if ! find "$API_CLIENTS_DIR" -name "*_api.ts" -type f -exec sed -i '' "s|from '../base'|from './base'|g" {} \;; then
        echo "❌ import 경로 수정 실패: base"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi
    echo "  ✅ API 클라이언트들 (*_api.ts) -> $API_CLIENTS_DIR"

    # API 클라이언트 파일명에서 실제 도메인 목록 추출
    DOMAINS=()
    if [ -d "$TEMP_DIR/api" ]; then
        while IFS= read -r api_file; do
            domain_name=$(basename "$api_file" -api.ts | sed 's/-$//')
            DOMAINS+=("$domain_name")
        done < <(find "$TEMP_DIR/api" -name "*-api.ts" -type f)
    fi

    # 타입 파일들을 도메인별 DTO/RO로 분리
    if [ ! -d "$TEMP_DIR/models" ]; then
        echo "❌ 타입 파일이 생성되지 않았습니다"
        rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
        exit 1
    fi

    echo "  📁 도메인별 분류 중..."

    # 모든 타입 파일 처리 (index.ts 제외)
    find "$TEMP_DIR/models" -type f -name "*.ts" ! -name "index.ts" | while read -r file; do
            filename=$(basename "$file")

            # 파일명에서 도메인 찾기 (가장 긴 매칭 우선)
            domain="common"
            max_match_len=0

            for d in "${DOMAINS[@]}"; do
                # 도메인이 파일명 앞부분에 매칭되는지 확인 (접두사 상관없이)
                # 예: csfaq-update-dto.ts, update-cs-dto.ts 등 모두 cs 도메인으로 매칭
                if [[ "$filename" == "$d-"* ]] || [[ "$filename" == *"-$d-"* ]] || [[ "$filename" == "$d"* ]]; then
                    match_len=${#d}
                    if [ $match_len -gt $max_match_len ]; then
                        domain="$d"
                        max_match_len=$match_len
                    fi
                fi
            done

            # 하이픈을 언더바로 변경
            domain_underscore=$(echo "$domain" | tr '-' '_')
            filename_underscore=$(echo "$filename" | tr '-' '_')

            # DTO/RO/Types 분류 및 복사
            # 1. -ro.ts 또는 -response.ts 로 끝나는 파일은 RO 폴더로
            # 2. -dto.ts, -create-dto.ts, -update-dto.ts, -request.ts 로 끝나는 파일은 DTO 폴더로
            # 3. 나머지 (enum, status, category 등)는 Types 폴더로
            if [[ "$filename" == *-ro.ts ]] || [[ "$filename" == *-response.ts ]]; then
                if ! mkdir -p "$API_RO_DIR/$domain_underscore"; then
                    echo "❌ RO 도메인 디렉토리 생성 실패: $domain_underscore"
                    rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
                    exit 1
                fi
                if ! cp "$file" "$API_RO_DIR/$domain_underscore/$filename_underscore"; then
                    echo "❌ RO 파일 복사 실패: $filename"
                    rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
                    exit 1
                fi
            elif [[ "$filename" == *-dto.ts ]] || [[ "$filename" == *-create-dto.ts ]] || [[ "$filename" == *-update-dto.ts ]] || [[ "$filename" == *-request.ts ]]; then
                if ! mkdir -p "$API_DTO_DIR/$domain_underscore"; then
                    echo "❌ DTO 도메인 디렉토리 생성 실패: $domain_underscore"
                    rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
                    exit 1
                fi
                if ! cp "$file" "$API_DTO_DIR/$domain_underscore/$filename_underscore"; then
                    echo "❌ DTO 파일 복사 실패: $filename"
                    rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
                    exit 1
                fi
            else
                # enum, status, category 등 공통 타입은 types 폴더로
                if ! mkdir -p "$API_TYPES_DIR/$domain_underscore"; then
                    echo "❌ Types 도메인 디렉토리 생성 실패: $domain_underscore"
                    rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
                    exit 1
                fi
                if ! cp "$file" "$API_TYPES_DIR/$domain_underscore/$filename_underscore"; then
                    echo "❌ Types 파일 복사 실패: $filename"
                    rm -rf "$TEMP_DIR" "$SWAGGER_DIR"
                    exit 1
                fi
            fi
        done

        echo "  ✅ DTO 파일들 -> $API_DTO_DIR/{domain}"
        echo "  ✅ RO 파일들 -> $API_RO_DIR/{domain}"
        echo "  ✅ Types 파일들 -> $API_TYPES_DIR/{domain}"

    # ==========================================
    # Post-processing: 같은 도메인 내 import 하이픈 → 언더스코어 변경
    # ==========================================
    echo "  🔧 같은 도메인 내 import 경로 수정 중 (하이픈 → 언더스코어)..."

    # DTO 파일들의 같은 폴더 내 import에서 하이픈을 언더스코어로 변경
    for domain_dir in "$API_DTO_DIR"/*/ ; do
        if [ -d "$domain_dir" ]; then
            find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f | while read -r file; do
                # from './' 로 시작하는 import 문에서 하이픈을 언더스코어로 변경
                # 여러 하이픈이 있을 수 있으므로 하이픈이 없을 때까지 반복
                while grep -q "from '\./[^']*-[^']*'" "$file"; do
                    sed -i '' -E "s|(from '\\./[^']*)-([^']*)|\1_\2|" "$file"
                done
            done
        fi
    done

    # RO 파일들의 같은 폴더 내 import에서 하이픈을 언더스코어로 변경
    for domain_dir in "$API_RO_DIR"/*/ ; do
        if [ -d "$domain_dir" ]; then
            find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f | while read -r file; do
                # from './' 로 시작하는 import 문에서 하이픈을 언더스코어로 변경
                while grep -q "from '\./[^']*-[^']*'" "$file"; do
                    sed -i '' -E "s|(from '\\./[^']*)-([^']*)|\1_\2|" "$file"
                done
            done
        fi
    done

    # Types 파일들의 같은 폴더 내 import에서 하이픈을 언더스코어로 변경
    for domain_dir in "$API_TYPES_DIR"/*/ ; do
        if [ -d "$domain_dir" ]; then
            find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f | while read -r file; do
                # from './' 로 시작하는 import 문에서 하이픈을 언더스코어로 변경
                while grep -q "from '\./[^']*-[^']*'" "$file"; do
                    sed -i '' -E "s|(from '\\./[^']*)-([^']*)|\1_\2|" "$file"
                done
            done
        fi
    done

    echo "  ✅ 같은 도메인 내 import 경로 수정 완료"

    # ==========================================
    # Post-processing: Cross-domain import 경로 수정
    # ==========================================
    echo "  🔧 Cross-domain import 경로 수정 중..."

    # 함수: 파일명으로 도메인과 타입(dto/ro/types) 찾기
    # 반환: "folder_type:domain" 형태 (예: "dto:device", "ro:app", "types:cs")
    find_file_location() {
        local search_filename="$1"

        # 먼저 DTO 폴더에서 검색
        for domain_dir in "$API_DTO_DIR"/*/ ; do
            if [ -d "$domain_dir" ]; then
                if [ -f "$domain_dir/$search_filename" ]; then
                    echo "dto:$(basename "$domain_dir")"
                    return 0
                fi
            fi
        done

        # RO 폴더에서 검색
        for domain_dir in "$API_RO_DIR"/*/ ; do
            if [ -d "$domain_dir" ]; then
                if [ -f "$domain_dir/$search_filename" ]; then
                    echo "ro:$(basename "$domain_dir")"
                    return 0
                fi
            fi
        done

        # Types 폴더에서 검색
        for domain_dir in "$API_TYPES_DIR"/*/ ; do
            if [ -d "$domain_dir" ]; then
                if [ -f "$domain_dir/$search_filename" ]; then
                    echo "types:$(basename "$domain_dir")"
                    return 0
                fi
            fi
        done

        return 1
    }

    # DTO 파일들의 import 경로 수정
    for domain_dir in "$API_DTO_DIR"/*/ ; do
        if [ -d "$domain_dir" ]; then
            current_domain=$(basename "$domain_dir")

            find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f | while read -r dto_file; do
                # 모든 상대 import 문에서 참조하는 파일명 추출 (패턴 확장)
                grep -E "^import.*from '\./[a-z_-]+'" "$dto_file" | while read -r import_line; do
                    # 파일명 추출 (예: './device-register-dto' -> 'device_register_dto')
                    imported_file=$(echo "$import_line" | sed -n "s/.*from '\\.\/\\([^']*\\)'.*/\\1/p" | tr '-' '_')

                    if [ -n "$imported_file" ]; then
                        # 확장자 추가
                        imported_file_with_ext="${imported_file}.ts"

                        # 현재 폴더에 파일이 있으면 스킵
                        if [ -f "$domain_dir/$imported_file_with_ext" ]; then
                            continue
                        fi

                        # DTO/RO 양쪽에서 파일 위치 찾기
                        location=$(find_file_location "$imported_file_with_ext")

                        if [ -n "$location" ]; then
                            target_type=$(echo "$location" | cut -d: -f1)
                            target_domain=$(echo "$location" | cut -d: -f2)

                            # 하이픈 버전의 파일명 (원본)
                            imported_file_hyphen=$(echo "$imported_file" | tr '_' '-')

                            # 경로 수정: ./file -> 적절한 상대 경로
                            # dto에서 다른 폴더로의 경로
                            if [ "$target_type" = "ro" ]; then
                                new_path="../../ro/${target_domain}/${imported_file}"
                            elif [ "$target_type" = "types" ]; then
                                new_path="../../types/${target_domain}/${imported_file}"
                            else
                                new_path="../${target_domain}/${imported_file}"
                            fi

                            sed -i '' "s|from '\\./${imported_file_hyphen}'|from '${new_path}'|g" "$dto_file"
                            sed -i '' "s|from '\\./${imported_file}'|from '${new_path}'|g" "$dto_file"
                        fi
                    fi
                done
            done
        fi
    done

    # RO files import path fix
    for domain_dir in "$API_RO_DIR"/*/ ; do
        if [ -d "$domain_dir" ]; then
            current_domain=$(basename "$domain_dir")

            find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f | while read -r ro_file; do
                # Extract all relative imports (expanded pattern)
                grep -E "^import.*from '\./[a-z_-]+'" "$ro_file" | while read -r import_line; do
                    imported_file=$(echo "$import_line" | sed -n "s/.*from '\\.\/\\([^']*\\)'.*/\\1/p" | tr '-' '_')

                    if [ -n "$imported_file" ]; then
                        imported_file_with_ext="${imported_file}.ts"

                        # Skip if file exists in current folder
                        if [ -f "$domain_dir/$imported_file_with_ext" ]; then
                            continue
                        fi

                        # Find file location in DTO/RO folders
                        location=$(find_file_location "$imported_file_with_ext")

                        if [ -n "$location" ]; then
                            target_type=$(echo "$location" | cut -d: -f1)
                            target_domain=$(echo "$location" | cut -d: -f2)

                            imported_file_hyphen=$(echo "$imported_file" | tr '_' '-')

                            # Fix path: ./file -> 적절한 상대 경로
                            # ro에서 다른 폴더로의 경로
                            if [ "$target_type" = "dto" ]; then
                                new_path="../../dto/${target_domain}/${imported_file}"
                            elif [ "$target_type" = "types" ]; then
                                new_path="../../types/${target_domain}/${imported_file}"
                            else
                                new_path="../${target_domain}/${imported_file}"
                            fi

                            sed -i '' "s|from '\\./${imported_file_hyphen}'|from '${new_path}'|g" "$ro_file"
                            sed -i '' "s|from '\\./${imported_file}'|from '${new_path}'|g" "$ro_file"
                        fi
                    fi
                done
            done
        fi
    done

    # Types 파일들의 import 경로 수정
    for domain_dir in "$API_TYPES_DIR"/*/ ; do
        if [ -d "$domain_dir" ]; then
            current_domain=$(basename "$domain_dir")

            find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f | while read -r types_file; do
                # Extract all relative imports (expanded pattern)
                grep -E "^import.*from '\./[a-z_-]+'" "$types_file" | while read -r import_line; do
                    imported_file=$(echo "$import_line" | sed -n "s/.*from '\\.\/\\([^']*\\)'.*/\\1/p" | tr '-' '_')

                    if [ -n "$imported_file" ]; then
                        imported_file_with_ext="${imported_file}.ts"

                        # Skip if file exists in current folder
                        if [ -f "$domain_dir/$imported_file_with_ext" ]; then
                            continue
                        fi

                        # Find file location in DTO/RO/Types folders
                        location=$(find_file_location "$imported_file_with_ext")

                        if [ -n "$location" ]; then
                            target_type=$(echo "$location" | cut -d: -f1)
                            target_domain=$(echo "$location" | cut -d: -f2)

                            imported_file_hyphen=$(echo "$imported_file" | tr '_' '-')

                            # Fix path: ./file -> 적절한 상대 경로
                            # types에서 다른 폴더로의 경로
                            if [ "$target_type" = "dto" ]; then
                                new_path="../../dto/${target_domain}/${imported_file}"
                            elif [ "$target_type" = "ro" ]; then
                                new_path="../../ro/${target_domain}/${imported_file}"
                            else
                                new_path="../${target_domain}/${imported_file}"
                            fi

                            sed -i '' "s|from '\\./${imported_file_hyphen}'|from '${new_path}'|g" "$types_file"
                            sed -i '' "s|from '\\./${imported_file}'|from '${new_path}'|g" "$types_file"
                        fi
                    fi
                done
            done
        fi
    done

    echo "  ✅ Cross-domain import 경로 수정 완료"
else
    echo "❌ SDK 생성 디렉토리가 존재하지 않습니다: $TEMP_DIR"
    exit 1
fi

# index.ts files generation

# Create models folder (bridges API clients' '../models' imports to dto/ro/types)
MODELS_DIR="./src/core/api/generated/models"
mkdir -p "$MODELS_DIR"
cat > "$MODELS_DIR/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
/**
 * Models index - Re-exports all DTOs, ROs, and Types
 * This file bridges the OpenAPI Generator's '../models' imports
 * to our separated dto/, ro/, and types/ folder structure
 *
 * Auto-generated - do not edit manually
 */

// Re-export all DTOs
export * from '../dto';

// Re-export all ROs
export * from '../ro';

// Re-export all Types
export * from '../types';
EOF
echo "  ✅ Models index -> $MODELS_DIR"

# API Clients index.ts
cat > "$API_CLIENTS_DIR/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
// Swagger 자동 생성 - 수동 편집 금지
export * from './base';
export * from './common';
export * from './configuration';
// API 클라이언트들
EOF

# API 클라이언트 파일들을 index.ts에 추가
find "$API_CLIENTS_DIR" -name "*_api.ts" -type f | while read -r file; do
    filename=$(basename "$file" .ts)
    echo "export * from './$filename';" >> "$API_CLIENTS_DIR/index.ts"
done

# 각 도메인별 DTO index.ts 생성
echo "📝 도메인별 index.ts 생성 중..."
for domain_dir in "$API_DTO_DIR"/*/ ; do
    if [ -d "$domain_dir" ]; then
        domain=$(basename "$domain_dir")
        cat > "$domain_dir/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
// Swagger 자동 생성 DTOs - 수동 편집 금지

EOF
        file_list=$(find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f)
        if [ -z "$file_list" ]; then
            # 파일이 없으면 빈 export 추가 (TypeScript 모듈로 인식되도록)
            echo "export {};" >> "$domain_dir/index.ts"
        else
            echo "$file_list" | while read -r file; do
                filename=$(basename "$file" .ts)
                echo "export * from './$filename';" >> "$domain_dir/index.ts"
            done
        fi
    fi
done

# DTO 최상위 index.ts (모든 도메인 re-export)
cat > "$API_DTO_DIR/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
// Swagger 자동 생성 DTOs - 수동 편집 금지
EOF
for domain_dir in "$API_DTO_DIR"/*/ ; do
    if [ -d "$domain_dir" ]; then
        domain=$(basename "$domain_dir")
        echo "export * from './$domain';" >> "$API_DTO_DIR/index.ts"
    fi
done

# 각 도메인별 RO index.ts 생성
for domain_dir in "$API_RO_DIR"/*/ ; do
    if [ -d "$domain_dir" ]; then
        domain=$(basename "$domain_dir")
        cat > "$domain_dir/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
// Swagger 자동 생성 ROs - 수동 편집 금지

EOF
        file_list=$(find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f)
        if [ -z "$file_list" ]; then
            # 파일이 없으면 빈 export 추가 (TypeScript 모듈로 인식되도록)
            echo "export {};" >> "$domain_dir/index.ts"
        else
            echo "$file_list" | while read -r file; do
                filename=$(basename "$file" .ts)
                echo "export * from './$filename';" >> "$domain_dir/index.ts"
            done
        fi
    fi
done

# RO 최상위 index.ts (모든 도메인 re-export)
cat > "$API_RO_DIR/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
// Swagger 자동 생성 ROs - 수동 편집 금지
EOF
for domain_dir in "$API_RO_DIR"/*/ ; do
    if [ -d "$domain_dir" ]; then
        domain=$(basename "$domain_dir")
        echo "export * from './$domain';" >> "$API_RO_DIR/index.ts"
    fi
done

# 각 도메인별 Types index.ts 생성
for domain_dir in "$API_TYPES_DIR"/*/ ; do
    if [ -d "$domain_dir" ]; then
        domain=$(basename "$domain_dir")
        cat > "$domain_dir/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
// Swagger 자동 생성 Types - 수동 편집 금지

EOF
        file_list=$(find "$domain_dir" -name "*.ts" -not -name "index.ts" -type f)
        if [ -z "$file_list" ]; then
            # 파일이 없으면 빈 export 추가 (TypeScript 모듈로 인식되도록)
            echo "export {};" >> "$domain_dir/index.ts"
        else
            echo "$file_list" | while read -r file; do
                filename=$(basename "$file" .ts)
                echo "export * from './$filename';" >> "$domain_dir/index.ts"
            done
        fi
    fi
done

# Types 최상위 index.ts (모든 도메인 re-export)
cat > "$API_TYPES_DIR/index.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
// Swagger 자동 생성 Types - 수동 편집 금지
EOF
for domain_dir in "$API_TYPES_DIR"/*/ ; do
    if [ -d "$domain_dir" ]; then
        domain=$(basename "$domain_dir")
        echo "export * from './$domain';" >> "$API_TYPES_DIR/index.ts"
    fi
done

# ==========================================
# API Factory 자동 생성
# ==========================================
echo "📝 API Factory 생성 중..."

API_FACTORY_FILE="./src/core/api/manual/api-factory.ts"

# 팩토리 파일 헤더
cat > "$API_FACTORY_FILE" << 'EOF'
/**
 * API 클라이언트 팩토리 (자동 생성)
 *
 * 이 파일은 make swagger 실행 시 자동으로 재생성됩니다.
 *
 * 모든 API 클라이언트를 커스텀 axios instance(apiClient)와 함께 생성하여
 * 토큰 리프레시 인터셉터가 적용되도록 합니다.
 *
 * 사용법:
 * ```typescript
 * import { createAuthApi, createProfileApi } from '@/core/api/manual/api-factory';
 *
 * const authApi = createAuthApi();
 * const profileApi = createProfileApi();
 * ```
 */

EOF

# API 클래스 import 목록 생성
echo "import {" >> "$API_FACTORY_FILE"
find "$API_CLIENTS_DIR" -name "*_api.ts" -type f | sort | while read -r file; do
    # 파일명에서 클래스명 생성 (e.g., auth_api.ts -> AuthApi)
    filename=$(basename "$file" .ts)
    # auth_api -> auth -> Auth -> AuthApi
    domain=$(echo "$filename" | sed 's/_api$//')
    # 각 단어의 첫 글자를 대문자로 (bash에서 awk 사용)
    classname=$(echo "$domain" | awk -F'_' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS='')
    classname="${classname}Api"
    echo "  $classname," >> "$API_FACTORY_FILE"
done
echo "} from '../generated/clients';" >> "$API_FACTORY_FILE"

# axios instance import
echo "import { apiClient, BASE_URL } from './axios-instance';" >> "$API_FACTORY_FILE"
echo "" >> "$API_FACTORY_FILE"

# 각 API에 대한 팩토리 함수 생성
find "$API_CLIENTS_DIR" -name "*_api.ts" -type f | sort | while read -r file; do
    filename=$(basename "$file" .ts)
    # 도메인명 추출 (e.g., auth_api -> auth, appointment_participant_api -> appointment_participant)
    domain=$(echo "$filename" | sed 's/_api$//')

    # 클래스명 생성 (e.g., auth -> AuthApi, appointment_participant -> AppointmentParticipantApi)
    classname=$(echo "$domain" | awk -F'_' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS='')
    classname="${classname}Api"

    # 주석용 도메인명 (e.g., auth -> Auth, appointment_participant -> Appointment Participant)
    domain_comment=$(echo "$domain" | awk -F'_' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS=' ')

    echo "// $domain_comment" >> "$API_FACTORY_FILE"
    echo "export function create${classname}(): ${classname} {" >> "$API_FACTORY_FILE"
    echo "  return new ${classname}(undefined, BASE_URL, apiClient);" >> "$API_FACTORY_FILE"
    echo "}" >> "$API_FACTORY_FILE"
    echo "" >> "$API_FACTORY_FILE"
done

echo "  ✅ API Factory 생성 완료: $API_FACTORY_FILE"

# 임시 폴더들 완전 삭제
echo "🧹 임시 파일 정리 중..."
rm -rf "$TEMP_DIR"
rm -rf "$SWAGGER_DIR"

echo ""
echo "✅ 완료! TypeScript SDK가 생성되었습니다"
echo ""
echo "📂 생성된 파일 (자동생성 - 수정 금지):"
echo "  - API 클라이언트: $API_CLIENTS_DIR"
echo "  - DTO: $API_DTO_DIR"
echo "  - RO: $API_RO_DIR"
echo "  - Types: $API_TYPES_DIR"
echo "  - API Factory: $API_FACTORY_FILE"
echo ""
echo "📂 수동 관리 파일 (make swagger 영향 없음):"
echo "  - 설정: ./src/core/api/manual/config.ts"
echo "  - 인터셉터: ./src/core/api/manual/axios-instance.ts"
echo ""
echo "💡 사용법 (팩토리 함수 권장):"
echo "  import { createAuthApi, createProfileApi } from '@/core/api/manual/api-factory';"
echo ""
echo "  const authApi = createAuthApi();"
echo "  const response = await authApi.apiV1AuthLoginPost(dto);"
