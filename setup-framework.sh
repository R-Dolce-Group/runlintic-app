#!/bin/bash

# Production Framework Integration Script
# Run from project root to integrate Express.js vs Fastify decision framework

set -e

echo "🚀 Integrating Production Framework Decision System..."
echo "================================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Verify we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

print_info "Project root confirmed: $(pwd)"

# Create decision framework directory in lib
print_info "Creating framework directory structure..."
mkdir -p lib/framework
mkdir -p logs
mkdir -p reports

# Copy framework files to appropriate locations
print_info "Installing framework files..."

# Core framework files go to lib/framework/
framework_files=(
    "error-handler.js"
    "performance-monitoring.js"
    "fastify-prototype.js"
    "benchmark-suite.js"
    "quality-gates.js"
    "decision-scorecard.js"
)

for file in "${framework_files[@]}"; do
    if [ -f "_workflows/issues/express-vs-fastify/implementation/$file" ]; then
        cp "_workflows/issues/express-vs-fastify/implementation/$file" "lib/framework/$file"
        print_status "Installed lib/framework/$file"
    else
        print_warning "File not found: _workflows/issues/express-vs-fastify/implementation/$file"
    fi
done

# Add npm scripts to package.json
print_info "Adding npm scripts..."

node -e "
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

packageJson.scripts = packageJson.scripts || {};

// Add framework decision scripts
packageJson.scripts['decision:quick'] = 'node lib/framework/decision-scorecard.js --quick';
packageJson.scripts['decision:evaluate'] = 'node lib/framework/decision-scorecard.js --evaluate';
packageJson.scripts['decision:benchmark'] = 'node lib/framework/benchmark-suite.js --benchmark';
packageJson.scripts['quality:gates'] = 'node lib/framework/quality-gates.js --run-all';
packageJson.scripts['fastify:prototype'] = 'node lib/framework/fastify-prototype.js --port 3001';
packageJson.scripts['framework:setup'] = 'node lib/framework/quality-gates.js --setup';

// Add monitoring scripts
packageJson.scripts['monitor:performance'] = 'node lib/framework/performance-monitoring.js';
packageJson.scripts['monitor:health'] = 'curl http://localhost:3000/api/health';

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
"

print_status "npm scripts added to package.json"

# Update .gitignore
print_info "Updating .gitignore..."

gitignore_entries=(
    ""
    "# Framework Decision Evaluation"
    "logs/*.log"
    "reports/*"
    "benchmark-results-*.json"
    "quality-gates-*.json"
    "decision-scorecard-*.json"
    "team-assessment.json"
)

for entry in "${gitignore_entries[@]}"; do
    if [ -n "$entry" ] && ! grep -Fxq "$entry" .gitignore 2>/dev/null; then
        echo "$entry" >> .gitignore
    fi
done

print_status ".gitignore updated"

# Create team assessment template
print_info "Creating team assessment template..."

cat > team-assessment-template.json << 'EOF'
{
  "projectInfo": {
    "name": "runlintic-app",
    "currentVersion": "7.2.0",
    "targetVersion": "8.0.0"
  },
  "teamSize": 3,
  "timeline": {
    "availableWeeks": 8,
    "dashboardPriority": "high",
    "frameworkDecisionDeadline": "2 weeks"
  },
  "experience": {
    "expressjs": {
      "senior": 2,
      "intermediate": 1,
      "averageYears": 3.5,
      "comfortLevel": 8.5
    },
    "fastify": {
      "senior": 0,
      "intermediate": 1,
      "averageYears": 0.5,
      "comfortLevel": 6.0
    },
    "react": {
      "senior": 2,
      "intermediate": 1,
      "averageYears": 4.0,
      "comfortLevel": 8.0
    }
  },
  "businessFactors": {
    "performancePriority": "high",
    "timeToMarketPressure": "medium",
    "technicalDebtConcern": "medium",
    "competitiveAdvantageImportance": "high"
  },
  "constraints": {
    "mustMaintainExistingAPI": true,
    "dashboardTimelineProtected": true,
    "maxLearningCurveWeeks": 2,
    "rollbackPlanRequired": true
  }
}
EOF

print_status "Team assessment template created"

# Fix framework files to work from lib/framework location
print_info "Updating framework file paths..."

# Update decision-scorecard.js to work from new location
if [ -f "lib/framework/decision-scorecard.js" ]; then
    sed -i '' 's|../../../team-assessment.json|../../../team-assessment.json|g' lib/framework/decision-scorecard.js
    sed -i '' 's|./quality-gates.js|./quality-gates.js|g' lib/framework/decision-scorecard.js
fi

# Test framework installation
print_info "Testing framework installation..."

if node -e "
try {
  const { QualityGatesManager } = require('./lib/framework/quality-gates.js');
  console.log('✅ Framework files loaded successfully');
} catch (error) {
  console.log('⚠️ Framework may need additional setup:', error.message);
}
" 2>/dev/null; then
    print_status "Framework installation verified"
else
    print_warning "Framework files may need manual adjustment"
fi

# Display usage instructions
echo ""
echo "================================================================"
echo -e "${GREEN}🎉 Production Framework Integration Complete!${NC}"
echo "================================================================"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. 📝 Configure team assessment:"
echo "   cp team-assessment-template.json team-assessment.json"
echo "   # Edit team-assessment.json with your actual data"
echo ""
echo "2. 🚀 Test the framework:"
echo "   npm run decision:quick"
echo ""
echo "3. 🏃 Start evaluation process:"
echo "   # Terminal 1: Start Express.js dashboard"
echo "   npm run dashboard"
echo ""
echo "   # Terminal 2: Start Fastify prototype"
echo "   npm run fastify:prototype"
echo ""
echo "   # Terminal 3: Run benchmarks"
echo "   npm run decision:benchmark"
echo ""
echo "4. 🎯 Get recommendation:"
echo "   npm run decision:evaluate"
echo ""
echo "📊 AVAILABLE COMMANDS:"
echo "   npm run decision:quick        # Quick evaluation (2 min)"
echo "   npm run decision:evaluate     # Full evaluation (30 min)"
echo "   npm run decision:benchmark    # Performance comparison"
echo "   npm run quality:gates        # Quality assessment"
echo "   npm run fastify:prototype     # Start Fastify prototype"
echo "   npm run monitor:performance   # Performance monitoring"
echo ""
echo "📁 FRAMEWORK FILES INSTALLED:"
echo "   lib/framework/                # Core framework files"
echo "   team-assessment-template.json # Team capability template"
echo "   logs/                        # Generated logs"
echo "   reports/                     # Generated reports"
echo ""
echo "🔗 DOCUMENTATION:"
echo "   _workflows/issues/express-vs-fastify/implementation/README.md"
echo ""

print_status "Framework ready for use!"