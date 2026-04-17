#!/bin/bash

echo "Woodworking-Aerospace Curriculum Assignment Count"
echo "=================================================="
echo ""

for level in {1..12}; do
  count=$(grep -c "^\s*level: ${level}," prisma/seeds/woodworking-aerospace-curriculum.ts)
  echo "Level $level: $count assignments"
done

echo ""
total=$(grep -c "^\s*level: [0-9]*," prisma/seeds/woodworking-aerospace-curriculum.ts)
echo "Total: $total assignments"
echo ""
echo "Target: 226 assignments"
missing=$((226 - total))
echo "Missing: $missing assignments"
