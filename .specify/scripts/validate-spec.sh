#!/bin/bash
# Usage: bash .specify/scripts/validate-spec.sh <feature-name>
# Checks that a spec directory has all required files and no empty sections.

set -e

FEATURE_NAME="$1"
SPEC_DIR=".specify/specs/$FEATURE_NAME"

if [ -z "$FEATURE_NAME" ]; then
  echo "❌ Usage: bash .specify/scripts/validate-spec.sh <feature-name>"
  exit 1
fi

if [ ! -d "$SPEC_DIR" ]; then
  echo "❌ No spec found at $SPEC_DIR"
  echo "   Run: bash .specify/scripts/new-spec.sh $FEATURE_NAME"
  exit 1
fi

PASS=true

check_file() {
  local file="$SPEC_DIR/$1"
  if [ ! -f "$file" ]; then
    echo "  ❌ Missing: $file"
    PASS=false
  else
    echo "  ✅ Found:   $file"
  fi
}

check_not_placeholder() {
  local file="$SPEC_DIR/$1"
  local pattern="$2"
  if grep -q "$pattern" "$file" 2>/dev/null; then
    echo "  ⚠️  Unfilled placeholder in $file: '$pattern'"
    PASS=false
  fi
}

echo ""
echo "🔍 Validating spec: $FEATURE_NAME"
echo ""

echo "Required files:"
check_file "spec.md"
check_file "plan.md"
check_file "tasks.md"

echo ""
echo "Placeholder checks:"
check_not_placeholder "spec.md" "YYYY-MM"
check_not_placeholder "spec.md" "(pending)"
check_not_placeholder "plan.md" "<!-- ASCII"
check_not_placeholder "tasks.md" "- [ ] ..."

echo ""
if [ "$PASS" = true ]; then
  echo "✅ Spec looks complete. Ready for review."
else
  echo "⚠️  Spec has gaps. Fill them before implementation."
  exit 1
fi
