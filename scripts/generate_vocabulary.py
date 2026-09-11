#!/usr/bin/env python3
"""Generate the bundled English Buddy vocabulary data from ECDICT.

The generated file contains dictionary metadata only. It does not include book
text or other copyrighted passages.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = PROJECT_ROOT / "assets" / "data" / "vocabulary.json.gz"
WORD_PATTERN = re.compile(r"^[A-Za-z][A-Za-z-]{1,20}$")

DECK_RULES = [
    ("CET-4", "cet4"),
    ("CET-6", "cet6"),
    ("雅思学术", "ielts"),
    ("托福学术", "toefl"),
    ("考研英语", "ky"),
    ("GRE / GMAT", "gre"),
    ("高中英语", "gk"),
    ("基础英语", "zk"),
]

SELECTION_QUOTAS = {
    "CET-4": 1450,
    "CET-6": 1000,
    "雅思学术": 850,
    "托福学术": 850,
    "高频英语": 650,
    "高中英语": 120,
    "考研英语": 50,
    "GRE / GMAT": 30,
}


def parse_rank(value: str) -> int:
    try:
        number = int(value or 0)
    except ValueError:
        return 0
    return number if number > 0 else 0


def clean_text(value: str, limit: int = 420) -> str:
    value = (value or "").replace("\r", " ")
    pieces = [
        re.sub(r"\s+", " ", piece).strip(" ;")
        for piece in re.split(r"\\n|\n", value)
    ]
    pieces = [
        piece
        for piece in pieces
        if piece and not piece.startswith(("[网络]", "[计]", "[医]", "[化]"))
    ]
    return "；".join(pieces[:2])[:limit]


def choose_deck(tags: str) -> str:
    normalized = {tag.strip().lower() for tag in (tags or "").split()}
    for deck, tag in DECK_RULES:
        if tag in normalized:
            return deck
    return "高频英语"


def build_entry(row: dict[str, str], index: int) -> dict[str, object] | None:
    word = (row.get("word") or "").strip()
    translation = clean_text(row.get("translation") or "")
    if not WORD_PATTERN.fullmatch(word) or not translation:
        return None

    rank_candidates = [
        rank
        for rank in (
            parse_rank(row.get("frq") or ""),
            parse_rank(row.get("bnc") or ""),
        )
        if rank
    ]
    rank = min(rank_candidates) if rank_candidates else 0
    tags = [tag for tag in (row.get("tag") or "").split() if tag]

    return {
        "id": f"bank-word-{index:05d}",
        "word": word.lower(),
        "phonetic": clean_text(row.get("phonetic") or "", 80),
        "part": clean_text(row.get("pos") or "", 40) or "word",
        "meaning": translation,
        "definition": clean_text(row.get("definition") or "", 500),
        "forms": clean_text(row.get("exchange") or "", 160),
        "frequencyRank": rank,
        "example": "",
        "translation": "",
        "deck": choose_deck(row.get("tag") or ""),
        "mastery": 0,
        "tags": tags[:5],
        "source": "ECDICT 公共词典 · 词频分类整理",
        "reviewAt": None,
        "builtin": True,
        "_rank": rank or 10_000_000,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("/private/tmp/ecdict.csv"),
        help="Path to the ECDICT CSV file.",
    )
    parser.add_argument("--count", type=int, default=28000)
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    args = parser.parse_args()

    if not args.source.is_file():
        raise SystemExit(f"Dictionary source not found: {args.source}")

    candidates: dict[str, dict[str, object]] = {}
    with args.source.open("r", encoding="utf-8", errors="ignore", newline="") as source:
        for row in csv.DictReader(source):
            entry = build_entry(row, len(candidates) + 1)
            if not entry:
                continue
            key = str(entry["word"])
            current = candidates.get(key)
            if current is None or entry["_rank"] < current["_rank"]:
                candidates[key] = entry

    ranked = sorted(
        candidates.values(),
        key=lambda item: (
            item["_rank"],
            -len(str(item["meaning"])),
            str(item["word"]),
        ),
    )
    selected = []
    selected_words = set()
    scale = args.count / sum(SELECTION_QUOTAS.values())
    for deck, base_quota in SELECTION_QUOTAS.items():
        quota = int(round(base_quota * scale))
        deck_items = [item for item in ranked if item["deck"] == deck]
        for item in deck_items[:quota]:
            selected.append(item)
            selected_words.add(item["word"])

    for item in ranked:
        if len(selected) >= args.count:
            break
        if item["word"] in selected_words:
            continue
        selected.append(item)
        selected_words.add(item["word"])

    selected = selected[: args.count]

    for index, entry in enumerate(selected, start=1):
        entry["id"] = f"bank-word-{index:05d}"
        entry.pop("_rank", None)

    payload = json.dumps(
        selected,
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(args.output, "wb", compresslevel=9) as output:
        output.write(payload)
    print(f"Generated {len(selected)} entries: {args.output}")


if __name__ == "__main__":
    main()
