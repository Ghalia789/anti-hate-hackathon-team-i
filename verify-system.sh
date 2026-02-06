#!/bin/bash
# Quick System Verification

set +e  # Don't exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo "  System Verification"
echo "========================================${NC}"
echo ""

all_good=true

# Check critical files
echo -e "${YELLOW}Checking critical files...${NC}"
critical_files=(
    "backend/app.py"
    "backend/models.py"
    "backend/config.py"
    "backend/requirements.txt"
    "backend/Dockerfile"
    "backend/.dockerignore"
    "frontend/src/App.jsx"
    "frontend/src/content.js"
    "frontend/src/background.js"
    "frontend/public/manifest.json"
    "frontend/package.json"
    "docker-compose.yml"
    "README.md"
    "DOCKER_QUICKSTART.md"
    "GCP_DEPLOYMENT.md"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file - MISSING!"
        all_good=false
    fi
done

echo ""

# Check Python syntax
echo -e "${YELLOW}Checking Python syntax...${NC}"
python_files=("backend/app.py" "backend/models.py" "backend/config.py")
for file in "${python_files[@]}"; do
    if [ -f "$file" ]; then
        if python -m py_compile "$file" 2>/dev/null; then
            echo -e "   ${GREEN}✓${NC} $file - OK"
        else
            echo -e "   ${RED}✗${NC} $file - SYNTAX ERROR!"
            all_good=false
        fi
    fi
done

echo ""

# Check Docker
echo -e "${YELLOW}Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "   ${GREEN}✓${NC} Docker installed"
    if docker info &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} Docker running"
    else
        echo -e "   ${YELLOW}⚠${NC} Docker not running"
    fi
else
    echo -e "   ${YELLOW}⚠${NC} Docker not available"
fi

echo ""

# Check docker-compose syntax
echo -e "${YELLOW}Checking docker-compose.yml syntax...${NC}"
if command -v docker-compose &> /dev/null; then
    if docker-compose config &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} docker-compose.yml valid"
    else
        echo -e "   ${RED}✗${NC} docker-compose.yml has errors!"
        all_good=false
    fi
else
    echo -e "   ${YELLOW}⚠${NC} docker-compose not available"
fi

echo ""

# Check Node.js and npm
echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    echo -e "   ${GREEN}✓${NC} Node.js installed"
    if command -v npm &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} npm installed"
    fi
else
    echo -e "   ${YELLOW}⚠${NC} Node.js/npm not available"
fi

echo ""

# Check Python
echo -e "${YELLOW}Checking Python...${NC}"
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    echo -e "   ${GREEN}✓${NC} $python_version"
    
    # Check required packages
    packages=("flask" "transformers" "torch" "langdetect")
    for pkg in "${packages[@]}"; do
        if python3 -c "import $pkg" 2>/dev/null; then
            echo -e "   ${GREEN}✓${NC} $pkg installed"
        else
            echo -e "   ${YELLOW}⚠${NC} $pkg NOT installed"
        fi
    done
elif command -v python &> /dev/null; then
    python_version=$(python --version)
    echo -e "   ${GREEN}✓${NC} $python_version"
    
    # Check required packages
    packages=("flask" "transformers" "torch" "langdetect")
    for pkg in "${packages[@]}"; do
        if python -c "import $pkg" 2>/dev/null; then
            echo -e "   ${GREEN}✓${NC} $pkg installed"
        else
            echo -e "   ${YELLOW}⚠${NC} $pkg NOT installed"
        fi
    done
else
    echo -e "   ${RED}✗${NC} Python not available"
    all_good=false
fi

echo ""

# Summary
echo -e "${CYAN}========================================"
if [ "$all_good" = true ]; then
    echo -e "   ${GREEN}All checks passed!${NC}"
    echo -e "   ${GREEN}System is ready for deployment${NC}"
else
    echo -e "   ${YELLOW}Some issues found${NC}"
    echo -e "   ${YELLOW}Review the errors above${NC}"
fi
echo -e "========================================${NC}"
echo ""

echo -e "${YELLOW}Quick Start Options:${NC}"
echo "1. Run with Docker: docker-compose up -d"
echo "2. Run locally: ./start.sh"
echo "3. Test Docker: ./test-docker.sh"
echo "4. Test API: cd backend && python test_multilingual.py"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- DOCKER_QUICKSTART.md - Docker quick start"
echo "- GCP_DEPLOYMENT.md - GCP deployment"
echo "- DEPLOYMENT_CHECKLIST.md - Full system check"
echo ""
