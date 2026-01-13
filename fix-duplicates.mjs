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
console.log(`Checking ${files.length} route files for duplicates`);

let fixedCount = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let modified = false;

  // Find all export async function blocks
  const functionPattern = /export async function (GET|POST|PUT|PATCH|DELETE)\([^)]+\) \{[\s\S]*?\n\}/g;
  const functions = [...content.matchAll(functionPattern)];

  for (const funcMatch of functions) {
    const funcBody = funcMatch[0];
    const funcName = funcMatch[1];

    // Check for duplicate "const { ... } = await params" in this function
    const paramsPattern = /const \{ ([^}]+) \} = await params/g;
    const paramsMatches = [...funcBody.matchAll(paramsPattern)];

    if (paramsMatches.length > 1) {
      console.log(`Found ${paramsMatches.length} param declarations in ${funcName} of ${file}`);

      // Keep only the first one, remove duplicates
      let newFuncBody = funcBody;
      let firstIndex = funcBody.indexOf(paramsMatches[0][0]);

      for (let i = 1; i < paramsMatches.length; i++) {
        const duplicate = paramsMatches[i][0];
        // Remove the duplicate line including newline
        newFuncBody = newFuncBody.replace('\n    ' + duplicate, '');
        newFuncBody = newFuncBody.replace(duplicate + '\n', '');
        newFuncBody = newFuncBody.replace(duplicate, '');
      }

      content = content.replace(funcBody, newFuncBody);
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(file, content, 'utf-8');
    console.log(`✓ Fixed: ${file}`);
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files with duplicates`);
