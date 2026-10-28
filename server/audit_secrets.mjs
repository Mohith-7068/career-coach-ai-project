import fs from 'node:fs';
import path from 'node:path';

// Extract actual secrets from .env to guarantee they are never present in any tracked file
let realSecrets = [];
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (['GEMINI_API_KEY', 'MONGODB_URI'].includes(key) && val.length > 8) {
        realSecrets.push({ key, val });
        // Also extract password part of MONGODB_URI
        const m = val.match(/mongodb\+srv:\/\/[^:]+:([^@]+)@/);
        if (m && m[1] && m[1].length > 5) {
          realSecrets.push({ key: 'MONGODB_PASSWORD', val: m[1] });
        }
      }
    }
  }
}

// Regex patterns to detect generic live secret formats
const genericPatterns = [
  { name: 'Google Gemini Live API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
  { name: 'Hardcoded Bearer Token', regex: /Bearer\s+[a-f0-9]{32,}/i },
];

const ignoredDirs = new Set(['node_modules', 'dist', 'server/data', '.git', 'scratch']);
const filesToScan = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.env') && entry.name !== '.env.example') continue;
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else {
      filesToScan.push(full);
    }
  }
}

walk('.');

let leaksFound = 0;
for (const f of filesToScan) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    // Check against real environment secrets
    for (const { key, val } of realSecrets) {
      if (content.includes(val)) {
        console.error(`LEAK RISK: Real secret for "${key}" found in file: ${f}`);
        leaksFound++;
      }
    }
    // Check against generic patterns
    for (const { name, regex } of genericPatterns) {
      if (regex.test(content)) {
        console.error(`LEAK RISK (${name}) in file: ${f}`);
        leaksFound++;
      }
    }
  } catch {
    // Binary or unreadable
  }
}

if (leaksFound === 0) {
  console.log(`✓ SUCCESS: 0 secrets, credentials, or personal tokens found across ${filesToScan.length} tracked files.`);
  process.exit(0);
} else {
  console.error(`❌ FAIL: Found ${leaksFound} potential secret exposures!`);
  process.exit(1);
}
