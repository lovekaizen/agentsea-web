const fs = require('fs');
const path = require('path');

// Mapping of page paths to their gradient types
const pageGradients = {
  'voice': { gradient: 'purple' },
  'quick-start': { gradient: 'blue' },
  'installation': { gradient: 'blue' },
  'cli': { gradient: 'cool' },
  'agents': { gradient: 'purple' },
  'providers': { gradient: 'warm' },
  'local-providers': { gradient: 'cool' },
  'tools': { gradient: 'warm' },
  'workflows': { gradient: 'purple' },
  'memory': { gradient: 'blue' },
  'formatting': { gradient: 'warm' },
  'conversation': { gradient: 'purple' },
  'local-models': { gradient: 'cool' },
  'acp-integration': { gradient: 'warm' },
  'mcp-overview': { gradient: 'purple' },
  'mcp-servers': { gradient: 'blue' },
  'mcp-tools': { gradient: 'warm' },
  'multi-tenancy': { gradient: 'purple' },
  'observability': { gradient: 'blue' },
  'nestjs': { gradient: 'warm' },
};

const docsDir = path.join(__dirname, 'app/docs');

// Get all page.tsx files in docs subdirectories
const getDocs = (dir) => {
  const results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const pagePath = path.join(fullPath, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        results.push({
          path: pagePath,
          name: item,
        });
      }
    }
  }

  return results;
};

const docs = getDocs(docsDir);

console.log(`Found ${docs.length} doc pages to update\n`);

for (const doc of docs) {
  const config = pageGradients[doc.name];
  if (!config) {
    console.log(`⏭️  Skipping ${doc.name} (no config)`);
    continue;
  }

  let content = fs.readFileSync(doc.path, 'utf8');

  // Check if already using PageHeader with titleGradient
  if (content.includes('titleGradient=')) {
    console.log(`✅ ${doc.name} already updated`);
    continue;
  }

  // Update imports to include PageHeader if not present
  if (!content.includes('PageHeader')) {
    content = content.replace(
      /import \{([^}]+)\} from ['"]\.\.\/\.\.\/components\/Section['"];/,
      `import { PageHeader,$1} from '../../components/Section';`
    );
  }

  // Pattern 1: <div className="mb-12">...<h1...>Title</h1>...<p...>Description</p>...</div>
  const pattern1 = /<div className="mb-12">\s*<h1 className="text-5xl font-bold mb-4">([^<]+)<\/h1>\s*<p className="text-xl text-base-content\/70">\s*([\s\S]*?)\s*<\/p>\s*<\/div>/;

  // Pattern 2: With {/* Header */} comment
  const pattern2 = /\{\/\* Header \*\/\}\s*<div className="mb-12">\s*<h1 className="text-5xl font-bold mb-4">([^<]+)<\/h1>\s*<p className="text-xl text-base-content\/70">\s*([\s\S]*?)\s*<\/p>\s*<\/div>/;

  let match = content.match(pattern2) || content.match(pattern1);

  if (match) {
    const title = match[1].trim();
    // Clean up description - remove JSX tags and normalize whitespace
    let description = match[2].trim()
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const newHeader = `<PageHeader
        title="${title}"
        titleGradient="${config.gradient}"
        description="${description}"
      />`;

    content = content.replace(match[0], newHeader);

    fs.writeFileSync(doc.path, content);
    console.log(`✨ Updated ${doc.name}`);
  } else {
    console.log(`⚠️  Could not find header pattern in ${doc.name}`);
  }
}

console.log('\nDone!');
