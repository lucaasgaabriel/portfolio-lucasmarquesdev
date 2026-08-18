#!/usr/bin/env node
// Invoked by lint-staged with the list of staged file paths.

import { readFileSync } from "node:fs";

const PATTERNS = [
  { name: "AWS Access Key ID", re: /AKIA[0-9A-Z]{16}/ },
  { name: "AWS Secret Access Key", re: /aws_secret_access_key\s*=\s*['"]?[A-Za-z0-9/+=]{40}['"]?/i },
  { name: "Private key block", re: /-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/ },
  { name: "Slack token", re: /xox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: "Generic API key/secret/token assignment", re: /(secret|api[_-]?key|access[_-]?token|auth[_-]?token|password)\s*[:=]\s*['"][A-Za-z0-9\-_/+=]{16,}['"]/i },
  { name: "GitHub token", re: /gh[pousr]_[A-Za-z0-9]{36,}/ },
];

const files = process.argv.slice(2);
let failed = false;

for (const file of files) {
  if (/\.env(\..+)?$/.test(file) && !/\.example$/.test(file)) {
    console.error(`✖ ${file}: .env files must not be committed.`);
    failed = true;
    continue;
  }

  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue; // deleted/renamed staged file — nothing to scan
  }

  for (const { name, re } of PATTERNS) {
    if (re.test(content)) {
      console.error(`✖ ${file}: possible ${name} detected.`);
      failed = true;
    }
  }
}

if (failed) {
  console.error(
    "\nSecret scan failed. Remove the sensitive value (or add a narrow allowlist) before committing.",
  );
  process.exit(1);
}
