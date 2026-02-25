#!/bin/bash
# Download Pokemon sprites from PokeAPI (Generation 1 Red/Blue style)

echo "Downloading Pokemon sprites..."

for id in 1 4 7 10 13 16 19 21 23 25 39 54 60 69 74 133; do
  echo "Downloading sprite for Pokemon #${id}..."
  curl -s -o "${id}.png" "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${id}.png"

  if [ -f "${id}.png" ]; then
    echo "  ✓ ${id}.png downloaded"
  else
    echo "  ✗ Failed to download ${id}.png"
  fi
done

echo ""
echo "Done! Sprites are ready to use."
echo "You can now start the app and see the sprites in battles."
