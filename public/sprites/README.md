# Pokemon Sprites

Place 32x32 pixel PNG sprites in this directory.

## Naming Convention

Sprites should be named by Pokemon ID:
- `1.png` - Bulbasaur
- `4.png` - Charmander
- `7.png` - Squirtle
- `10.png` - Caterpie
- `13.png` - Weedle
- `16.png` - Pidgey
- `19.png` - Rattata
- `21.png` - Spearow
- `23.png` - Ekans
- `25.png` - Pikachu
- `39.png` - Jigglypuff
- `54.png` - Psyduck
- `60.png` - Poliwag
- `69.png` - Bellsprout
- `74.png` - Geodude
- `133.png` - Eevee

## Sprite Resources

You can get Pokemon sprites from:
- [PokéSprite Project](https://github.com/msikma/pokesprite) - Large collection of Pokemon sprites
- [PokeAPI Sprites](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/)
- Create your own using pixel art tools like Aseprite or Piskel

## Quick Download Script

Run this from the sprites directory to download gen 1 sprites from PokeAPI:

```bash
#!/bin/bash
# Download red/blue generation sprites (they're 56x56 but work well)

for id in 1 4 7 10 13 16 19 21 23 25 39 54 60 69 74 133; do
  curl -o "${id}.png" "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${id}.png"
done
```

## Using the Placeholder Generator

Open `sprite-generator.html` in your browser to create simple colored placeholder sprites based on Pokemon types.
