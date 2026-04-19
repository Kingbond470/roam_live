#!/bin/bash
# Usage: bash .specify/scripts/new-spec.sh <feature-name>
# Example: bash .specify/scripts/new-spec.sh user-accounts
#
# Creates a new spec directory from templates.
# Run this before writing any code for a Tier 1 or Tier 2 feature.

set -e

FEATURE_NAME="$1"

if [ -z "$FEATURE_NAME" ]; then
  echo "❌ Usage: bash .specify/scripts/new-spec.sh <feature-name>"
  echo "   Example: bash .specify/scripts/new-spec.sh user-accounts"
  exit 1
fi

SPEC_DIR=".specify/specs/$FEATURE_NAME"
TEMPLATE_DIR=".specify/templates"

if [ -d "$SPEC_DIR" ]; then
  echo "❌ Spec already exists at $SPEC_DIR"
  exit 1
fi

mkdir -p "$SPEC_DIR"

# Copy templates and replace placeholder
for template in spec-template.md plan-template.md tasks-template.md; do
  target="${template/-template/}"
  sed "s/\[Feature Name\]/$FEATURE_NAME/g" "$TEMPLATE_DIR/$template" > "$SPEC_DIR/$target"
done

echo ""
echo "✅ Spec scaffolded at $SPEC_DIR"
echo ""
echo "Next steps:"
echo "  1. Fill in $SPEC_DIR/spec.md  — what + why + user stories + acceptance criteria"
echo "  2. Fill in $SPEC_DIR/plan.md  — architecture + state changes + key files"
echo "  3. Fill in $SPEC_DIR/tasks.md — ordered task checklist"
echo "  4. Get spec.md reviewed before writing any code"
echo ""
echo "Remember: read .specify/constitution.md before starting."
