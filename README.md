# Baiboly Protestanta Malagasy (1865) — React Application

Fampiharana maoderina amin'ny React, TypeScript, ary Vite ho an'ny Baiboly Protestanta amin'ny teny Malagasy (dikan-teny 1865).

## Toetoetra sy zava-bita (Features)

- **Famakiana Baiboly (Reader View)**:
  - Fizarana mazava araka ny Testamenta Taloha sy Testamenta Vaovao.
  - Famantarana sy fitetezana haingana ny boky 66 sy ireo toko 1 189.
  - Fanamarihana andininy (highlighting) sy fanaovana tahaka (copy verse with reference).
  - Fanovana habean'ny soratra (A⁻, A, A⁺, A⁺⁺).
  - Loharano sy endri-tsoratra kanto (Cormorant Garamond, Lora, DM Sans).
  - Bokotra sy hitsin-dàlana fitetezana (ArrowLeft, ArrowRight).

- **Lisitry ny Boky (Books Overview)**:
  - Fijerena ireo boky 66 misy tarehimarika feno (66 Boky, 1 189 Toko, 31 105 Andininy).
  - Sivana haingana araka ny anaran'ny boky.
  - Fidio avy hatrany ny toko tiana hovakiana (Chapter picker).

- **Fikarohana haingana (Instant Full-Text Search)**:
  - Fikarohana maivana sy haingana amin'ireo andininy 31 105 manontolo.
  - Hitsin-dàlana `Ctrl+K` na `Cmd+K` amin'ny klavie.
  - Fanasongadinana ny teny voakaroka (`<mark>`) sy fitsidihana mivantana ny andininy.
  - Pejy fikarohana manokana misy sivana araka ny Testamenta sy Boky.

- **Fisehoana (Theming & Persistence)**:
  - Loko maizina (Dark Mode) sy mazava (Light Mode).
  - Fitahirizana ny toerana novakiana farany sy ny safidy ao amin'ny `localStorage`.

## Fandefasana (Development)

```bash
# Fametrahana ireo fonosana
npm install

# Fandefasana ny mpizara eo an-toerana (Port 3000)
npm run dev

# Fanamboarana ny kinova famokarana
npm run build
```

---
*Dikan-teny: Baiboly Malagasy 1865 (mg1865)*
