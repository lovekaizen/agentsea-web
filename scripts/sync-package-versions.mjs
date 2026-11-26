// Reads the version of every AgentSea package from its own package.json and
// writes app/data/package-versions.json. The site build uses that snapshot, so
// it does not need the agentsea repository.
//
// Usage: npm run sync:versions            (reads ../agentsea)
//        AGENTSEA_REPO=/path npm run sync:versions
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import process from 'node:process';
import console from 'node:console';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = resolve(process.env.AGENTSEA_REPO ?? join(root, '..', 'agentsea'));
const packagesDir = join(repo, 'packages');

if (!existsSync(packagesDir)) {
  console.error(`No packages directory at ${packagesDir}. Set AGENTSEA_REPO.`);
  process.exit(1);
}

const versions = {};
for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = join(packagesDir, entry.name, 'package.json');
  if (!existsSync(file)) continue;
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  if (pkg.name && pkg.version) versions[pkg.name] = pkg.version;
}

const sorted = Object.fromEntries(Object.entries(versions).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(root, 'app', 'data', 'package-versions.json'), JSON.stringify(sorted, null, 2) + '\n');
console.log(`Wrote ${Object.keys(sorted).length} package versions from ${packagesDir}`);
