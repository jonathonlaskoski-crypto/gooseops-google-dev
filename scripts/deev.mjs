#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Allow passing extra args to Vite (e.g., --port 3001)
const viteArgs = process.argv.slice(2);

// Run config check first
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const checkConfig = spawn('node', [path.join(__dirname, 'check-config.mjs')], { stdio: 'inherit' });

checkConfig.on('exit', (code) => {
  if (code !== 0) {
    console.error('\n🚨 GooseOps config check failed. Fix .env and try again.');
    process.exit(code);
  }
  // If config check passes, start Vite directly
  console.log('\n✅ Config check passed. Starting Vite dev server...\n');
  const vite = spawn('npx', ['vite', ...viteArgs], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  });
  vite.on('exit', (viteCode) => {
    if (viteCode !== 0) {
      console.error(`\n❌ Vite exited with code ${viteCode}`);
    }
    process.exit(viteCode);
  });
});
