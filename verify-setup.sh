#!/bin/bash

echo "=================================="
echo "Setup Verification Script"
echo "=================================="
echo ""

ERRORS=0

# Check folder structure
echo "✓ Checking folder structure..."
for dir in backend frontend docs; do
    if [ ! -d "$dir" ]; then
        echo "  ❌ Missing directory: $dir"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check backend files
echo "✓ Checking backend files..."
for file in backend/app.py backend/config.py backend/requirements.txt backend/app.yaml backend/.env.example; do
    if [ ! -f "$file" ]; then
        echo "  ❌ Missing file: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check frontend files
echo "✓ Checking frontend files..."
for file in frontend/package.json frontend/vite.config.js frontend/index.html frontend/src/App.jsx frontend/src/api.js frontend/src/main.jsx; do
    if [ ! -f "$file" ]; then
        echo "  ❌ Missing file: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check documentation
echo "✓ Checking documentation..."
for file in README.md CONTRIBUTING.md LICENSE docs/GDPR_COMPLIANCE.md docs/STATELESS_ARCHITECTURE.md docs/QUICK_START.md docs/API_EXAMPLES.md docs/DEPLOYMENT.md docs/PROJECT_SUMMARY.md; do
    if [ ! -f "$file" ]; then
        echo "  ❌ Missing file: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check scripts
echo "✓ Checking scripts..."
for file in setup.sh run-dev.sh; do
    if [ ! -f "$file" ]; then
        echo "  ❌ Missing file: $file"
        ERRORS=$((ERRORS + 1))
    elif [ ! -x "$file" ]; then
        echo "  ❌ File not executable: $file"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check .gitignore
echo "✓ Checking .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo "  ❌ Missing .gitignore"
    ERRORS=$((ERRORS + 1))
fi

# Verify Python syntax
echo "✓ Verifying Python syntax..."
python3 -m py_compile backend/app.py backend/config.py 2>/dev/null
if [ $? -ne 0 ]; then
    echo "  ❌ Python syntax errors"
    ERRORS=$((ERRORS + 1))
fi

# Check for privacy compliance
echo "✓ Checking GDPR compliance..."

# No database usage
DB_COUNT=$(grep -r "SQLAlchemy\|pymongo\|redis\|postgresql\|mysql" backend/ frontend/ 2>/dev/null | wc -l)
if [ $DB_COUNT -gt 0 ]; then
    echo "  ❌ Database usage detected"
    ERRORS=$((ERRORS + 1))
fi

# No improper localStorage usage (excluding comments)
STORAGE_COUNT=$(grep -r "localStorage\.setItem\|sessionStorage\.setItem" frontend/src/ 2>/dev/null | wc -l)
if [ $STORAGE_COUNT -gt 0 ]; then
    echo "  ❌ localStorage usage detected"
    ERRORS=$((ERRORS + 1))
fi

# Check for session configuration
SESSION_CONFIG=$(grep "SESSION_TYPE = None" backend/*.py | wc -l)
if [ $SESSION_CONFIG -lt 1 ]; then
    echo "  ❌ Stateless session configuration missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed!"
    echo "=================================="
    echo ""
    echo "Ready to start:"
    echo "  1. Copy backend/.env.example to backend/.env"
    echo "  2. Add your Hugging Face token to backend/.env"
    echo "  3. Run: ./setup.sh"
    echo "  4. Run: ./run-dev.sh"
    echo ""
    exit 0
else
    echo "❌ $ERRORS error(s) found"
    echo "=================================="
    exit 1
fi
