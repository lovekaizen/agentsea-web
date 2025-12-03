#!/bin/bash

# Deploy AgentSea Website to SDK GitHub Pages
# This script builds the static site and copies it to the agentic-sdk docs folder

set -e  # Exit on error

echo "🚀 Starting deployment to agentic-sdk GitHub Pages..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
WEBSITE_DIR="$(pwd)"
SDK_DIR="../agentic-sdk"
DOCS_DIR="${SDK_DIR}/docs"

echo -e "${BLUE}📁 Website directory: ${WEBSITE_DIR}${NC}"
echo -e "${BLUE}📁 SDK directory: ${SDK_DIR}${NC}"
echo -e "${BLUE}📁 Docs directory: ${DOCS_DIR}${NC}"

# Check if SDK directory exists
if [ ! -d "$SDK_DIR" ]; then
    echo -e "${RED}❌ Error: SDK directory not found at ${SDK_DIR}${NC}"
    echo "Please ensure the agentic-sdk repository is in the parent directory."
    exit 1
fi

# Step 1: Clean previous builds
echo -e "\n${BLUE}🧹 Cleaning previous builds...${NC}"
rm -rf out .next

# Step 2: Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

# Step 3: Build the static site
echo -e "\n${BLUE}🔨 Building static site...${NC}"
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Error: Build failed - 'out' directory not created${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Step 4: Prepare SDK docs directory
echo -e "\n${BLUE}📂 Preparing SDK docs directory...${NC}"

# Create docs directory if it doesn't exist
mkdir -p "$DOCS_DIR"

# Backup existing docs if they exist
if [ -d "$DOCS_DIR" ] && [ "$(ls -A $DOCS_DIR)" ]; then
    BACKUP_DIR="${SDK_DIR}/docs_backup_$(date +%Y%m%d_%H%M%S)"
    echo -e "${BLUE}💾 Backing up existing docs to ${BACKUP_DIR}${NC}"
    cp -r "$DOCS_DIR" "$BACKUP_DIR"
fi

# Clear existing docs
echo -e "${BLUE}🗑️  Clearing existing docs...${NC}"
rm -rf "${DOCS_DIR}"/*

# Step 5: Copy built site to SDK docs
echo -e "\n${BLUE}📋 Copying built site to SDK docs directory...${NC}"
cp -r out/* "$DOCS_DIR/"

# Step 6: Create .nojekyll file for GitHub Pages
echo -e "\n${BLUE}📝 Creating .nojekyll file...${NC}"
touch "${DOCS_DIR}/.nojekyll"

# Step 7: Create CNAME file if needed (optional)
# Uncomment and modify if you have a custom domain
# echo "docs.agentsea.dev" > "${DOCS_DIR}/CNAME"

# Step 8: Summary
echo -e "\n${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "  • Built site size: $(du -sh out | cut -f1)"
echo -e "  • Docs directory: ${DOCS_DIR}"
echo -e "  • Files copied: $(find ${DOCS_DIR} -type f | wc -l | tr -d ' ')"

# Step 9: Git operations (optional)
read -p "$(echo -e ${BLUE}Do you want to commit and push changes to agentic-sdk? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$SDK_DIR"

    echo -e "\n${BLUE}📝 Git status:${NC}"
    git status docs/

    echo -e "\n${BLUE}📝 Adding changes...${NC}"
    git add docs/

    read -p "$(echo -e ${BLUE}Enter commit message [Update documentation website]: ${NC})" COMMIT_MSG
    COMMIT_MSG=${COMMIT_MSG:-"Update documentation website"}

    echo -e "\n${BLUE}💾 Committing changes...${NC}"
    git commit -m "$COMMIT_MSG"

    read -p "$(echo -e ${BLUE}Push to remote? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "\n${BLUE}🚀 Pushing to remote...${NC}"
        git push
        echo -e "${GREEN}✅ Changes pushed successfully!${NC}"
    fi

    cd "$WEBSITE_DIR"
fi

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
echo -e "${BLUE}📖 Next steps:${NC}"
echo -e "  1. Check the changes in ${SDK_DIR}/docs"
echo -e "  2. Test the site locally: cd ${SDK_DIR} && npx serve docs"
echo -e "  3. If you haven't pushed yet, review and push when ready"
echo -e "  4. GitHub Pages will automatically deploy from the docs/ folder"
echo -e "\n${BLUE}🌐 Once deployed, your site will be available at:${NC}"
echo -e "  https://YOUR-USERNAME.github.io/agentic-sdk/"
