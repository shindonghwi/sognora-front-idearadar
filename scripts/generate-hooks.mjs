/**
 * Script to generate React Query hooks from Swagger-generated API clients
 *
 * This script:
 * 1. Reads all *_api.ts files from src/core/api/clients/
 * 2. Extracts public methods from each API class
 * 3. Determines if each method is a Query (GET) or Mutation (POST/PUT/PATCH/DELETE)
 * 4. Generates React Query hooks for each method
 * 5. Creates index.ts files to export all hooks
 */

/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to convert camelCase to kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Helper to determine if a method is a query or mutation based on HTTP method
function getHookType(methodName) {
  const lowerName = methodName.toLowerCase();

  // Mutations: POST, PUT, PATCH, DELETE
  if (lowerName.includes('post') || lowerName.includes('put') ||
      lowerName.includes('patch') || lowerName.includes('delete')) {
    return 'mutation';
  }

  // Queries: GET
  if (lowerName.includes('get')) {
    return 'query';
  }

  // Default to query
  return 'query';
}

// Extract unique type names from a parameter list
function extractTypeNames(params) {
  const types = new Set();
  // Built-in TypeScript types that should not be imported
  const builtInTypes = ['string', 'number', 'boolean', 'any', 'void', 'object', 'File', 'Blob', 'Date', 'Array'];

  params.forEach(param => {
    const parts = param.split(':');
    if (parts.length > 1) {
      const type = parts[1].trim();
      // Only include custom types (not primitives or built-in types)
      if (type && !builtInTypes.includes(type)) {
        types.add(type);
      }
    }
  });
  return Array.from(types);
}

// Extract methods from API class file
function extractMethods(fileContent, className) {
  const methods = [];

  // Find public methods in the class
  const classMatch = fileContent.match(new RegExp(`export class ${className} extends BaseAPI[\\s\\S]*?\\n}`));
  if (!classMatch) return methods;

  const classBody = classMatch[0];

  // Match public method signatures
  const methodRegex = /public\s+(\w+)\(([^)]*)\)/g;
  let match;

  while ((match = methodRegex.exec(classBody)) !== null) {
    const methodName = match[1];
    const params = match[2];

    // Parse parameters
    const paramList = params.split(',').map(p => p.trim()).filter(p => p && !p.includes('options?'));

    // Extract types
    const types = extractTypeNames(paramList);

    methods.push({
      name: methodName,
      params: paramList,
      types: types,
      type: getHookType(methodName)
    });
  }

  return methods;
}

// Helper to convert API class name to factory function name
// e.g., AuthApi -> createAuthApi, AppointmentParticipantApi -> createAppointmentParticipantApi
function getFactoryFunctionName(apiClassName) {
  return `create${apiClassName}`;
}

// Generate query hook
function generateQueryHook(domainName, clientName, method) {
  const hookName = camelToKebab(method.name);
  const hasParams = method.params.length > 0;

  // Generate type imports - use dto path for DTO/Request types, ro for RO/Response, types for enums
  let typeImports = '';
  if (method.types && method.types.length > 0) {
    const isDtoType = (t) => t.endsWith('DTO') || t.endsWith('Request');
    const isRoType = (t) => t.endsWith('RO') || t.endsWith('Response');
    // Enum/Status/Category types go to types folder
    const isEnumType = (t) => t.includes('Status') || t.includes('Category') || t.includes('Type') || (!isDtoType(t) && !isRoType(t) && !t.includes('Api'));

    const dtoTypes = method.types.filter(isDtoType);
    const roTypes = method.types.filter(isRoType);
    const enumTypes = method.types.filter(t => !isDtoType(t) && !isRoType(t) && isEnumType(t));
    const otherTypes = method.types.filter(t => !isDtoType(t) && !isRoType(t) && !isEnumType(t));

    if (dtoTypes.length > 0) {
      typeImports += `import type { ${dtoTypes.join(', ')} } from '@/core/api/generated/dto';\n`;
    }
    if (roTypes.length > 0) {
      typeImports += `import type { ${roTypes.join(', ')} } from '@/core/api/generated/ro';\n`;
    }
    if (enumTypes.length > 0) {
      typeImports += `import type { ${enumTypes.join(', ')} } from '@/core/api/generated/types';\n`;
    }
    if (otherTypes.length > 0) {
      typeImports += `import type { ${otherTypes.join(', ')} } from '@/core/api/generated/clients';\n`;
    }
  }

  // Extract parameter names and types
  const paramDeclarations = method.params.map(p => {
    const parts = p.split(':').map(s => s.trim());
    // Remove optional marker (?) from parameter name
    const name = parts[0].replace(/\?$/, '');
    return { name, type: parts[1] || 'any', isOptional: parts[0].endsWith('?') };
  });

  const paramNames = paramDeclarations.map(p => p.name).join(', ');
  const paramTypes = paramDeclarations.map(p => `${p.name}${p.isOptional ? '?' : ''}: ${p.type}`).join(', ');
  const queryKeyParams = paramDeclarations.map(p => p.name).join(', ');

  // API 클래스 이름 생성 (e.g., AuthApi)
  const apiClassName = clientName.replace('Client', 'Api').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

  // 팩토리 함수 이름 생성 (e.g., createAuthApi)
  const factoryFunctionName = getFactoryFunctionName(apiClassName);

  // Hook 이름에서 apiV1 제거 (e.g., apiV1AuthLoginPost -> AuthLoginPost)
  const cleanMethodName = method.name.replace(/^apiV\d+/, '');

  return `import { useQuery } from '@tanstack/react-query';
import { ${factoryFunctionName} } from '@/core/api/manual/api-factory';
${typeImports}
export function use${cleanMethodName.charAt(0).toUpperCase() + cleanMethodName.slice(1)}(${paramTypes}${hasParams ? ', ' : ''}options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['${domainName}', '${method.name}'${queryKeyParams ? `, ${queryKeyParams}` : ''}],
    queryFn: async () => {
      const response = await ${factoryFunctionName}().${method.name}(${paramNames});
      return response.data;
    },
    ...options,
  });
}
`;
}

// Generate mutation hook
function generateMutationHook(domainName, clientName, method) {
  const hookName = camelToKebab(method.name);
  const hasParams = method.params.length > 0;

  // API 클래스 이름 생성 (e.g., AuthApi)
  const apiClassName = clientName.replace('Client', 'Api').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

  // 팩토리 함수 이름 생성 (e.g., createAuthApi)
  const factoryFunctionName = getFactoryFunctionName(apiClassName);

  // Hook 이름에서 apiV1 제거 (e.g., apiV1AuthLoginPost -> AuthLoginPost)
  const cleanMethodName = method.name.replace(/^apiV\d+/, '');

  // Generate type imports - use dto path for DTO/Request types, ro for RO/Response, types for enums
  let typeImports = '';
  if (method.types && method.types.length > 0) {
    const isDtoType = (t) => t.endsWith('DTO') || t.endsWith('Request');
    const isRoType = (t) => t.endsWith('RO') || t.endsWith('Response');
    // Enum/Status/Category types go to types folder
    const isEnumType = (t) => t.includes('Status') || t.includes('Category') || t.includes('Type') || (!isDtoType(t) && !isRoType(t) && !t.includes('Api'));

    const dtoTypes = method.types.filter(isDtoType);
    const roTypes = method.types.filter(isRoType);
    const enumTypes = method.types.filter(t => !isDtoType(t) && !isRoType(t) && isEnumType(t));
    const otherTypes = method.types.filter(t => !isDtoType(t) && !isRoType(t) && !isEnumType(t));

    if (dtoTypes.length > 0) {
      typeImports += `import type { ${dtoTypes.join(', ')} } from '@/core/api/generated/dto';\n`;
    }
    if (roTypes.length > 0) {
      typeImports += `import type { ${roTypes.join(', ')} } from '@/core/api/generated/ro';\n`;
    }
    if (enumTypes.length > 0) {
      typeImports += `import type { ${enumTypes.join(', ')} } from '@/core/api/generated/types';\n`;
    }
    if (otherTypes.length > 0) {
      typeImports += `import type { ${otherTypes.join(', ')} } from '@/core/api/generated/clients';\n`;
    }
  }

  if (!hasParams) {
    // No parameters - simple case
    return `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ${factoryFunctionName} } from '@/core/api/manual/api-factory';
${typeImports}
export function use${cleanMethodName.charAt(0).toUpperCase() + cleanMethodName.slice(1)}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await ${factoryFunctionName}().${method.name}();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${domainName}'] });
    },
  });
}
`;
  }

  // Has parameters
  const paramCount = method.params.length;

  // Parse parameters with optional handling
  const paramDeclarations = method.params.map(p => {
    const parts = p.split(':').map(s => s.trim());
    const name = parts[0].replace(/\?$/, '');
    return {
      name,
      type: parts[1] || 'any',
      isOptional: parts[0].endsWith('?')
    };
  });

  if (paramCount === 1) {
    // Single parameter - pass it directly
    const param = paramDeclarations[0];

    return `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ${factoryFunctionName} } from '@/core/api/manual/api-factory';
${typeImports}
export function use${cleanMethodName.charAt(0).toUpperCase() + cleanMethodName.slice(1)}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (${param.name}: ${param.type}) => {
      const response = await ${factoryFunctionName}().${method.name}(${param.name});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${domainName}'] });
    },
  });
}
`;
  } else {
    // Multiple parameters - use object destructuring
    const paramNames = paramDeclarations.map(p => p.name).join(', ');
    const paramTypes = paramDeclarations.map(p => `${p.name}${p.isOptional ? '?' : ''}: ${p.type}`).join('; ');

    return `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ${factoryFunctionName} } from '@/core/api/manual/api-factory';
${typeImports}
export function use${cleanMethodName.charAt(0).toUpperCase() + cleanMethodName.slice(1)}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ${paramNames} }: { ${paramTypes} }) => {
      const response = await ${factoryFunctionName}().${method.name}(${paramNames});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${domainName}'] });
    },
  });
}
`;
  }
}

// Generate hook file
function generateHookFile(domainName, clientName, method, outputDir) {
  // 파일 이름에서도 apiV1 제거
  const cleanMethodName = method.name.replace(/^apiV\d+/, '');
  const hookFileName = `use-${camelToKebab(cleanMethodName)}.ts`;
  const hookFilePath = path.join(outputDir, hookFileName);

  const content = method.type === 'query' ?
    generateQueryHook(domainName, clientName, method) :
    generateMutationHook(domainName, clientName, method);

  fs.writeFileSync(hookFilePath, content, 'utf-8');
  console.log(`  ✓ Generated ${hookFileName}`);

  return hookFileName.replace('.ts', '');
}

// Generate index.ts file
function generateIndexFile(domainName, hookFiles, outputDir) {
  const exports = hookFiles.map(fileName => {
    const hookName = fileName.split('-').map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    return `export { ${hookName} } from './${fileName}';`;
  }).join('\n');

  const indexPath = path.join(outputDir, 'index.ts');
  fs.writeFileSync(indexPath, exports + '\n', 'utf-8');
  console.log(`  ✓ Generated index.ts with ${hookFiles.length} exports\n`);
}

// Main function
function main() {
  // process.cwd() 사용 - 심볼릭 링크로 실행해도 호출 위치 기준으로 동작
  const clientsDir = path.join(process.cwd(), 'src/core/api/generated/clients');
  const domainDir = path.join(process.cwd(), 'src/core/domain');

  // Get all *_api.ts files
  const apiFiles = fs.readdirSync(clientsDir)
    .filter(f => f.endsWith('_api.ts') && f !== 'base.ts');

  console.log(`Found ${apiFiles.length} API client files\n`);

  let totalHooksGenerated = 0;
  const summary = [];

  apiFiles.forEach(apiFile => {
    const domainName = apiFile.replace('_api.ts', '');

    // Convert domain name to PascalCase for class name (e.g., discount_policy -> DiscountPolicy)
    const className = domainName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Api';

    const clientName = `${domainName}Client`;

    console.log(`Processing ${apiFile} (${className})...`);

    // Read API file
    const apiFilePath = path.join(clientsDir, apiFile);
    const fileContent = fs.readFileSync(apiFilePath, 'utf-8');

    // Extract methods
    const methods = extractMethods(fileContent, className);

    if (methods.length === 0) {
      console.log(`  ⚠ No methods found, skipping\n`);
      return;
    }

    // Create domain directory
    const outputDir = path.join(domainDir, domainName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate hooks
    const hookFiles = [];
    methods.forEach(method => {
      const hookFileName = generateHookFile(domainName, clientName, method, outputDir);
      hookFiles.push(hookFileName);
    });

    // Generate index.ts
    generateIndexFile(domainName, hookFiles, outputDir);

    totalHooksGenerated += methods.length;
    summary.push({
      domain: domainName,
      hooks: methods.length
    });
  });

  // Print summary
  console.log('='.repeat(50));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(50));
  console.log(`Total clients processed: ${apiFiles.length}`);
  console.log(`Total hooks generated: ${totalHooksGenerated}`);
  console.log('\nBreakdown by domain:');
  summary.forEach(({ domain, hooks }) => {
    console.log(`  ${domain}: ${hooks} hooks`);
  });
}

// Run
try {
  main();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
