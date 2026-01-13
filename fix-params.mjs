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

// Find all route files in app/api
const files = findRouteFiles('app/api');

console.log(`Found ${files.length} route files to check`);

let fixedCount = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let modified = false;

  // Pattern: Find functions with Promise<{ ... }> params that haven't been destructured
  const functionPattern = /export async function (GET|POST|PUT|PATCH|DELETE)\(\s*request:\s*NextRequest,\s*\{\s*params\s*\}:\s*\{\s*params:\s*Promise<\{([^}]+)\}>\s*\}\s*\)\s*\{/g;

  let match;
  const replacements = [];

  while ((match = functionPattern.exec(content)) !== null) {
    const functionName = match[1];
    const paramsContent = match[2].trim();
    const fullMatch = match[0];
    const matchIndex = match.index;

    // Check if the next few lines already have "await params"
    const nextLines = content.substring(matchIndex, matchIndex + fullMatch.length + 200);
    if (nextLines.includes('await params')) {
      continue; // Already fixed
    }

    // Parse param names
    const paramNames = paramsContent.split(/[;,]/).map(p => {
      const parts = p.trim().split(':');
      return parts[0].trim();
    }).filter(Boolean);

    const destructure = paramNames.length === 1 ? `{ ${paramNames[0]} }` : `{ ${paramNames.join(', ')} }`;

    replacements.push({
      paramNames,
      functionName,
      fullMatch,
      destructure
    });
  }

  // Apply replacements
  for (const { paramNames, functionName, fullMatch, destructure } of replacements) {
    // Find the try block after this function
    const functionIndex = content.indexOf(fullMatch);
    if (functionIndex === -1) continue;

    const afterFunction = content.substring(functionIndex + fullMatch.length);
    const tryMatch = afterFunction.match(/\n  try \{/);

    if (tryMatch) {
      const tryIndex = functionIndex + fullMatch.length + tryMatch.index;
      const tryBlock = tryMatch[0];

      // Insert destructuring
      const newTryBlock = `\n  try {\n    const ${destructure} = await params`;
      content = content.substring(0, tryIndex) + newTryBlock + content.substring(tryIndex + tryBlock.length);
      modified = true;

      // Replace all params.id, params.progressId, etc.
      paramNames.forEach(paramName => {
        const regex = new RegExp(`params\\.${paramName}\\b`, 'g');
        content = content.replace(regex, paramName);
      });
    }
  }

  if (modified) {
    writeFileSync(file, content, 'utf-8');
    console.log(`✓ Fixed: ${file}`);
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files`);
