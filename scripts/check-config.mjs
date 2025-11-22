#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Simple .env parser (since we can't use dotenv)
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  return env;
}

// Load .env
const envPath = path.resolve('.env');
const envVars = loadEnv(envPath);

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('\n🚨 .env file not found. Please create .env from .env.template');
  process.exit(1);
}

const required = [
  'VITE_AZURE_OPENAI_API_KEY',
  'VITE_AZURE_OPENAI_ENDPOINT',
  'VITE_AZURE_OPENAI_DEPLOYMENT',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_SERVICE_ROLE_KEY'
]

const optional = [
  'VITE_COPILOT_STUDIO_ENDPOINT',
  'VITE_SLACK_BOT_TOKEN',
  'VITE_ASANA_API_KEY',
  'VITE_TEAMS_API_KEY',
  'VITE_DATAVERSE_ENVIRONMENT_URL',
  'VITE_DATAVERSE_API_KEY',
  'VITE_POWERPAGES_SITE_URL',
  'VITE_CLAUDE_API_KEY'
]

const missing = required.filter(k => !envVars[k] || envVars[k] === '')
const warnings = optional.filter(k => !envVars[k] || envVars[k] === '')

console.log('\nGooseOps Configuration Health Check')
console.log('--------------------------------')

if (missing.length > 0) {
  console.error('\n🚨 Missing required environment variables:')
  missing.forEach(k => console.error(` - ${k}`))
  console.error('\nPlease add the missing keys to your .env file, then retry.')
  process.exit(1)
}

console.log('\n✅ Required environment variables found')

if (warnings.length > 0) {
  console.warn('\n⚠️ Optional integrations not configured:')
  warnings.forEach(k => console.warn(` - ${k}`))
  console.warn('\nSome optional features (Copilot Studio, Slack, Asana, Teams, Dataverse) may be disabled.')
}

console.log('\nActive Config Summary:')
console.log(` - Azure OpenAI: ${envVars.VITE_AZURE_OPENAI_ENDPOINT || 'not set'}`)
console.log(` - Supabase URL: ${envVars.VITE_SUPABASE_URL}`)
console.log(` - Copilot Studio: ${envVars.VITE_COPILOT_STUDIO_ENDPOINT ? 'configured' : 'not configured'}`)

console.log('\nAll checks passed. Starting dev server...')
process.exit(0)
