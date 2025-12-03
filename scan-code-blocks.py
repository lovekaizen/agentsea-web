#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def scan_file(file_path):
    """Scan a file for code blocks with formatting issues."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    issues = []

    # Find all CodeBlock components
    code_block_pattern = r'<CodeBlock[^>]*>\s*\{`(.*?)`\}\s*</CodeBlock>'
    matches = re.finditer(code_block_pattern, content, re.DOTALL)

    for match in matches:
        code = match.group(1)
        start_pos = match.start()

        # Calculate line number
        line_num = content[:start_pos].count('\n') + 1

        # Check for issues
        block_issues = []

        # 1. Check for multiple consecutive spaces (3+)
        if re.search(r'   +', code):
            multi_space_lines = [i+1 for i, line in enumerate(code.split('\n')) if re.search(r'   +', line)]
            if multi_space_lines:
                block_issues.append(f"Multiple consecutive spaces on lines: {multi_space_lines}")

        # 2. Check for unindented object properties
        lines = code.split('\n')
        for i, line in enumerate(lines):
            # Look for lines that should be indented but aren't
            # Pattern: after a line ending with { or [, the next non-empty line should be indented
            if i > 0 and lines[i-1].rstrip().endswith(('{', '[')):
                if line and not line[0].isspace() and line.strip() and not line.strip().startswith(('/', '}', ']')):
                    block_issues.append(f"Unindented property at line {i+1}: '{line.strip()[:50]}'")

        # 3. Check for inconsistent indentation in objects
        indent_levels = []
        for line in lines:
            if line.strip() and not line.strip().startswith('//'):
                # Count leading spaces
                spaces = len(line) - len(line.lstrip())
                if spaces > 0:
                    indent_levels.append(spaces)

        # Check if indentation uses consistent steps
        if indent_levels:
            unique_indents = sorted(set(indent_levels))
            if len(unique_indents) > 1:
                # Check if they're multiples of 2
                non_even = [i for i in unique_indents if i % 2 != 0]
                if non_even:
                    block_issues.append(f"Odd indentation levels found: {non_even}")

        if block_issues:
            issues.append({
                'file': file_path,
                'line': line_num,
                'issues': block_issues,
                'preview': code[:100].replace('\n', '\\n')
            })

    return issues

def main():
    # Get all doc pages
    doc_files = [
        'app/docs/acp-integration/page.tsx',
        'app/docs/agents/page.tsx',
        'app/docs/cli/page.tsx',
        'app/docs/conversation/page.tsx',
        'app/docs/formatting/page.tsx',
        'app/docs/installation/page.tsx',
        'app/docs/local-models/page.tsx',
        'app/docs/local-providers/page.tsx',
        'app/docs/mcp-overview/page.tsx',
        'app/docs/mcp-servers/page.tsx',
        'app/docs/memory/page.tsx',
        'app/docs/multi-tenancy/page.tsx',
        'app/docs/nestjs/page.tsx',
        'app/docs/observability/page.tsx',
        'app/docs/providers/page.tsx',
        'app/docs/quick-start/page.tsx',
        'app/docs/tools/page.tsx',
        'app/docs/workflows/page.tsx',
    ]

    all_issues = []

    for file_path in doc_files:
        if Path(file_path).exists():
            issues = scan_file(file_path)
            all_issues.extend(issues)

    # Print summary
    print(f"\n{'='*80}")
    print(f"CODE BLOCK FORMATTING SCAN RESULTS")
    print(f"{'='*80}\n")

    if not all_issues:
        print("✓ No formatting issues found!")
        return 0

    print(f"Found {len(all_issues)} code blocks with potential issues:\n")

    for issue in all_issues:
        print(f"\n{issue['file']}:{issue['line']}")
        for problem in issue['issues']:
            print(f"  - {problem}")
        print(f"  Preview: {issue['preview']}...")

    print(f"\n{'='*80}")
    print(f"Total issues: {len(all_issues)}")
    print(f"{'='*80}\n")

    return 1 if all_issues else 0

if __name__ == '__main__':
    sys.exit(main())
