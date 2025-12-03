#!/bin/bash

# Test Static Build Script
# Builds the site and serves it locally to verify functionality

set -e  # Exit on error

echo "🧪 Testing static build..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean previous builds
echo -e "\n${BLUE}🧹 Cleaning previous builds...${NC}"
rm -rf out .next

# Step 2: Build the static site
echo -e "\n${BLUE}🔨 Building static site...${NC}"
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Error: Build failed - 'out' directory not created${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Step 3: Analyze build output
echo -e "\n${BLUE}📊 Build Analysis:${NC}"
echo -e "  • Build size: $(du -sh out | cut -f1)"
echo -e "  • Total files: $(find out -type f | wc -l | tr -d ' ')"
echo -e "  • HTML files: $(find out -name '*.html' | wc -l | tr -d ' ')"
echo -e "  • CSS files: $(find out -name '*.css' | wc -l | tr -d ' ')"
echo -e "  • JS files: $(find out -name '*.js' | wc -l | tr -d ' ')"

# Step 4: Check for common issues
echo -e "\n${BLUE}🔍 Checking for common issues...${NC}"

# Check for 404.html
if [ -f "out/404.html" ]; then
    echo -e "${GREEN}✅ 404 page exists${NC}"
else
    echo -e "${YELLOW}⚠️  No 404 page found (Next.js will create 404/index.html)${NC}"
fi

# Check for index.html
if [ -f "out/index.html" ]; then
    echo -e "${GREEN}✅ Homepage exists${NC}"
else
    echo -e "${RED}❌ No homepage found!${NC}"
    exit 1
fi

# Check for docs pages
DOCS_COUNT=$(find out/docs -name 'index.html' 2>/dev/null | wc -l | tr -d ' ')
if [ "$DOCS_COUNT" -gt "0" ]; then
    echo -e "${GREEN}✅ Found ${DOCS_COUNT} documentation pages${NC}"
else
    echo -e "${YELLOW}⚠️  No documentation pages found${NC}"
fi

# Check for examples page
if [ -f "out/examples/index.html" ]; then
    echo -e "${GREEN}✅ Examples page exists${NC}"
else
    echo -e "${YELLOW}⚠️  Examples page not found${NC}"
fi

# Step 5: Check for required static assets
echo -e "\n${BLUE}🎨 Checking static assets...${NC}"
if [ -d "out/_next/static" ]; then
    echo -e "${GREEN}✅ Next.js static assets found${NC}"
    echo -e "  • CSS bundles: $(find out/_next/static -name '*.css' | wc -l | tr -d ' ')"
    echo -e "  • JS bundles: $(find out/_next/static -name '*.js' | wc -l | tr -d ' ')"
else
    echo -e "${RED}❌ No static assets found!${NC}"
    exit 1
fi

# Step 6: Serve the site locally
echo -e "\n${BLUE}🌐 Starting local server...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📖 Site will be available at: http://localhost:3000${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n${BLUE}Testing checklist:${NC}"
echo -e "  [ ] Homepage loads correctly"
echo -e "  [ ] Navigation works"
echo -e "  [ ] All documentation pages accessible"
echo -e "  [ ] Examples page displays correctly"
echo -e "  [ ] Code blocks are formatted properly"
echo -e "  [ ] DaisyUI theme is applied"
echo -e "  [ ] All links work"
echo -e "  [ ] No 404 errors in console"
echo -e "\n${BLUE}Press Ctrl+C to stop the server when testing is complete.${NC}\n"

# Check if npx serve is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Please install Node.js and npm.${NC}"
    exit 1
fi

# Serve the site
npx serve out -p 3000
