#!/bin/bash

# Script to verify all documentation pages are using consistent layout

echo "Checking documentation pages for consistent layout..."

# List of files to check
files=(
  "app/docs/page.tsx"
  "app/docs/quick-start/page.tsx"
  "app/docs/agents/page.tsx"
  "app/docs/providers/page.tsx"
  "app/docs/local-providers/page.tsx"
  "app/docs/tools/page.tsx"
  "app/docs/workflows/page.tsx"
  "app/docs/memory/page.tsx"
  "app/docs/formatting/page.tsx"
  "app/docs/conversation/page.tsx"
  "app/docs/voice/page.tsx"
  "app/docs/local-models/page.tsx"
  "app/docs/acp-integration/page.tsx"
  "app/docs/mcp-overview/page.tsx"
  "app/docs/mcp-servers/page.tsx"
  "app/docs/multi-tenancy/page.tsx"
  "app/docs/observability/page.tsx"
  "app/docs/nestjs/page.tsx"
  "app/docs/cli/page.tsx"
  "app/docs/installation/page.tsx"
  "app/api/page.tsx"
  "app/examples/page.tsx"
)

updated=0
needs_update=0

for file in "${files[@]}"; do
  if grep -q "PageContainer" "$file"; then
    echo "✓ $file - Using PageContainer"
    ((updated++))
  else
    echo "✗ $file - Needs update"
    ((needs_update++))
  fi
done

echo ""
echo "Summary:"
echo "  Updated: $updated"
echo "  Needs update: $needs_update"
echo "  Total: ${#files[@]}"
