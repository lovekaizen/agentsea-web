#!/usr/bin/env python3
import re
from pathlib import Path

def fix_code_block_indentation(code):
    """Fix indentation issues in a code block."""
    lines = code.split('\n')
    fixed_lines = []

    for line in lines:
        # Skip empty lines
        if not line.strip():
            fixed_lines.append('')
            continue

        # Get the content and leading whitespace
        stripped = line.lstrip()
        leading_spaces = len(line) - len(stripped)

        # Check for multiple consecutive spaces in the middle of the line
        # Replace sequences of 3+ spaces with single space
        cleaned = re.sub(r'   +', ' ', stripped)

        # Reconstruct the line with proper indentation
        # Keep the leading spaces but clean the rest
        fixed_line = ' ' * leading_spaces + cleaned
        fixed_lines.append(fixed_line)

    return '\n'.join(fixed_lines)

def process_file(file_path):
    """Process a single file to fix code block indentation."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Find and fix all CodeBlock components
    def replace_code_block(match):
        pre = match.group(1)  # Everything before the code
        code = match.group(2)  # The actual code content
        post = match.group(3)  # Everything after the code

        # Fix the code
        fixed_code = fix_code_block_indentation(code)

        return f'{pre}{fixed_code}{post}'

    # Pattern to match CodeBlock with template literal
    pattern = r'(<CodeBlock[^>]*>\s*\{`)(.+?)(`\}\s*</CodeBlock>)'
    content = re.sub(pattern, replace_code_block, content, flags=re.DOTALL)

    # Only write if changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def main():
    # List of all doc files
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

    print("Fixing code block indentation issues...\n")

    fixed_count = 0
    for file_path in doc_files:
        if Path(file_path).exists():
            if process_file(file_path):
                print(f"✓ Fixed: {file_path}")
                fixed_count += 1
            else:
                print(f"  No changes: {file_path}")

    print(f"\nFixed {fixed_count} files")

if __name__ == '__main__':
    main()
