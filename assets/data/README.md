# Vocabulary data

`vocabulary.json.gz` contains 58,000 generated entries and is generated from
public dictionary metadata. It is loaded as compressed data to reduce network
and local storage usage. It contains
word, phonetic, part of speech, translation, definition, tags, source and
classification fields only.

Missing phonetics are filled from the open CMU Pronunciation Dictionary and
converted to IPA. Oxford dictionary content is not bundled.

`automotive-vocabulary.js` contains 230 curated automotive English terms in
10 categories, including powertrain, EV systems, chassis, electrical,
diagnostics, manufacturing, business and driving safety.

`article-library.json.gz` contains 2,623 original English-learning articles and
study literature guides. These are self-authored learning materials, not
fabricated citations or copies of published papers.

Regenerate after obtaining the source CSV:

```bash
python3 scripts/generate_vocabulary.py --source /private/tmp/ecdict.csv --count 58000
```

Book text, academic paper full text and copyrighted passages are not included.
