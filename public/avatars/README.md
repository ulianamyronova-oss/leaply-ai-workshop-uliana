# Wizard avatars

Drop the four PNG illustrations from chat into this folder with these exact filenames:

- `witch-violet.png` — purple-haired witch with pink flame
- `elf-mage.png` — white-haired elf in starry purple cape
- `cat-sage.png` — gray cat wizard with staff
- `cat-shadow.png` — black cat with purple flame

The wizard creation flow + gazette card both read from `/avatars/{id}.png`. If a
file is missing, that avatar shows as a broken image — drop the file and
hard-refresh.

This README isn't shipped to users (Vite/Next.js serves `.png`s from `public/`
but ignores random `.md` files for the route map).
