#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findRouteFiles(dir, files = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findRouteFiles(fullPath, files);
    } else if (item === 'route.ts') {
      files.push(fullPath);
    }
  }
  return files;
}

const files = findRouteFiles('app/api');
console.log(`Checking ${files.length} route files for missing params`);

let fixedCount = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let modified = false;

  // Find functions with Promise<{ ... }> params
  const functionPattern = /export async function (GET|POST|PUT|PATCH|DELETE)\(\s*request:\s*NextRequest,\s*\{\s*params\s*\}:\s*\{\s*params:\s*Promise<\{([^}]+)\}>\s*\}\s*\)\s*\{([\s\S]*?)(?=\nexport|$)/g;

  const matches = [...content.matchAll(functionPattern)];

  for (const match of matches) {
    const funcName = match[1];
    const paramsContent = match[2].trim();
    const funcBody = match[3];

    // Check if function body has params usage but no "await params"
    const hasParamsUsage = /\bwhere:\s*\{[^}]*\bid\b/.test(funcBody) || funcBody.includes('bookingId:') || funcBody.includes('progressId:');
    const hasAwaitParams = funcBody.includes('await params');

    if (hasParamsUsage && !hasAwaitParams) {
      // Parse param names from type
      const paramNames = paramsContent.split(/[;,]/).map(p => {
        const parts = p.trim().split(':');
        return parts[0].trim();
      }).filter(Boolean);

      const destructure = paramNames.length === 1 ? `{ ${paramNames[0]} }` : `{ ${paramNames.join(', ')} }`;

      // Find the position after "try {" to insert the destructuring
      const tryIndex = content.indexOf('try {', match.index);
      if (tryIndex !== -1) {
        const afterTry = tryIndex + 'try {'.length;
        const insertPoint = content.indexOf('\n', afterTry) + 1;

        // Insert the const declaration
        const indent = '    ';
        const declaration = `${indent}const ${destructure} = await params;\n`;

        content = content.substring(0, insertPoint) + declaration + content.substring(insertPoint);
        modified = true;

        console.log(`Added params destructuring to ${funcName} in ${file}`);
      }
    }
  }

  if (modified) {
    writeFileSync(file, content, 'utf-8');
    console.log(`✓ Fixed: ${file}`);
    fixedCount++;
  }
});

console.log(`\nRestored ${fixedCount} files`);
