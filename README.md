# Baiboly Protestanta Malagasy (1865)

Baiboly Protestanta Malagasy — dikan-teny tamin'ny 1865.

## Antontan-kevitra

```
data/
├── baiboly.db        ← Toerana fototra (SQLite)
├── index.json        ← Lisitry ny boky rehetra
└── json/
    ├── 01_Genesisy.json
    ├── 02_Eksodosy.json
    └── ...            ← Boky 66 manontolo
```

## Isan'ny voarakitra

| Zavatra   | Isa     |
|-----------|---------|
| Boky      | 66      |
| Toko      | 1 189   |
| Andininy  | 31 105  |

## Fomba fampiasana (JSON)

```json
{
  "book_number": 1,
  "name": "Genesisy",
  "chapters": [
    {
      "chapter": 1,
      "verses": [
        { "verse": 1, "text": "Tamin'ny voalohany Andriamanitra nahary ny lanitra sy ny tany." }
      ]
    }
  ]
}
```

## Fomba fampiasana (SQLite)

```sql
-- Hitady andininy iray
SELECT b.name, c.chapter_number, v.verse_number, v.text
FROM verses v
JOIN chapters c ON v.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE b.name = 'Jaona' AND c.chapter_number = 3 AND v.verse_number = 16;
```

## Lisitry ny boky

### Testamenta Taloha
Genesisy · Eksodosy · Levitikosy · Nomery · Deoteronomia · Josoa · Mpitsara · Rota · 1-2 Samoela · 1-2 Mpanjaka · 1-2 Tantara · Ezra · Nehemia · Estera · Joba · Salamo · Ohabolana · Mpitoriteny · Tononkiran'i Solomona · Isaia · Jeremia · Fitomaniana · Ezekiela · Daniela · Hosea · Joela · Amosa · Obadia · Jona · Mika · Nahoma · Habakoka · Zefania · Hagay · Zakaria · Malakia

### Testamenta Vaovao
Matio · Marka · Lioka · Jaona · Asan'ny Apostoly · Romana · 1-2 Korintiana · Galatiana · Efesiana · Filipiana · Kolosiana · 1-2 Tesaloniana · 1-2 Timoty · Titosy · Filemona · Hebreo · Jakoba · 1-2 Petera · 1-2-3 Jaona · Joda · Apokalypsy

---

*Dikan-teny: Baiboly Malagasy 1865 (mg1865)*
