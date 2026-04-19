#!/bin/bash
# Usage: bash .specify/scripts/list-specs.sh
# Lists all specs and their current status line.

echo ""
echo "📋 Nearaway Spec Registry"
echo "========================="
echo ""

for spec_dir in .specify/specs/*/; do
  feature=$(basename "$spec_dir")
  spec_file="$spec_dir/spec.md"

  if [ -f "$spec_file" ]; then
    status=$(grep "^## Status" -A1 "$spec_file" | tail -1 | sed 's/^[[:space:]]*//')
    printf "  %-35s %s\n" "$feature" "$status"
  else
    printf "  %-35s %s\n" "$feature" "⚠️  No spec.md"
  fi
done

echo ""
echo "Total: $(ls -d .specify/specs/*/ 2>/dev/null | wc -l | tr -d ' ') specs"
echo ""
echo "Commands:"
echo "  New spec:      bash .specify/scripts/new-spec.sh <name>"
echo "  Validate spec: bash .specify/scripts/validate-spec.sh <name>"
