#!/usr/bin/env python3
"""Fill missing pronunciation fields with open CMUdict IPA data."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


ARPABET_TO_IPA = {
    "AA": "ɑ",
    "AE": "æ",
    "AH": "ə",
    "AO": "ɔ",
    "AW": "aʊ",
    "AY": "aɪ",
    "B": "b",
    "CH": "tʃ",
    "D": "d",
    "DH": "ð",
    "EH": "ɛ",
    "ER": "ɚ",
    "EY": "eɪ",
    "F": "f",
    "G": "ɡ",
    "HH": "h",
    "IH": "ɪ",
    "IY": "i",
    "JH": "dʒ",
    "K": "k",
    "L": "l",
    "M": "m",
    "N": "n",
    "NG": "ŋ",
    "OW": "oʊ",
    "OY": "ɔɪ",
    "P": "p",
    "R": "ɹ",
    "S": "s",
    "SH": "ʃ",
    "T": "t",
    "TH": "θ",
    "UH": "ʊ",
    "UW": "u",
    "V": "v",
    "W": "w",
    "Y": "j",
    "Z": "z",
    "ZH": "ʒ",
}

VOWELS = {
    "AA",
    "AE",
    "AH",
    "AO",
    "AW",
    "AY",
    "EH",
    "ER",
    "EY",
    "IH",
    "IY",
    "OW",
    "OY",
    "UH",
    "UW",
}

MANUAL_PHONETICS = {
    "emphasise": "/ˈemfəsaɪz/",
    "counselling": "/ˈkaʊnsəlɪŋ/",
    "minimise": "/ˈmɪnɪmaɪz/",
    "organisational": "/ˌɔːrɡənaɪˈzeɪʃənl/",
    "ii": "/ˌaɪˈaɪ/",
    "iii": "/ˌaɪaɪˈaɪ/",
    "iv": "/ˌaɪˈviː/",
    "eg": "/ˌiːˈdʒiː/",
    "pp": "/ˌpiːˈpiː/",
    "mp": "/ˌemˈpiː/",
    "nhs": "/ˌeneɪtʃˈes/",
    "gp": "/ˌdʒiːˈpiː/",
    "gop": "/ˌdʒiːoʊˈpiː/",
    "ici": "/ˌaɪsiːˈaɪ/",
    "eec": "/ˌiːiːˈsiː/",
    "ft": "/ˌefˈtiː/",
    "ml": "/ˌemˈel/",
    "imf": "/ˌaɪemˈef/",
    "anc": "/ˌeɪenˈsiː/",
    "swindon": "/ˈswɪndən/",
}


def phones_to_ipa(pronunciation: str) -> str:
    result: list[str] = []
    for phone in pronunciation.split():
        match = re.fullmatch(r"([A-Z]+)([012]?)", phone)
        if not match:
            continue
        symbol, stress = match.groups()
        value = ARPABET_TO_IPA.get(symbol)
        if not value:
            continue
        if symbol in VOWELS and stress == "1":
            result.append("ˈ")
        elif symbol in VOWELS and stress == "2":
            result.append("ˌ")
        result.append(value)
    return f"/{''.join(result)}/" if result else ""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--vocabulary",
        type=Path,
        default=Path(__file__).resolve().parents[1]
        / "assets"
        / "data"
        / "vocabulary.js",
    )
    parser.add_argument(
        "--pronouncing-path",
        type=Path,
        default=Path("/private/tmp/pronouncing_deps"),
    )
    args = parser.parse_args()

    sys.path.insert(0, str(args.pronouncing_path))
    import pronouncing  # type: ignore

    source = args.vocabulary.read_text(encoding="utf-8")
    payload_start = source.index("=") + 1
    payload_end = source.rstrip().rstrip(";").rfind("]") + 1
    entries = json.loads(source[payload_start:payload_end])

    filled = 0
    for entry in entries:
        word = str(entry.get("word") or "").lower()
        if not word:
            continue
        if not entry.get("phonetic") and word in MANUAL_PHONETICS:
            entry["phonetic"] = MANUAL_PHONETICS[word]
            entry["phoneticUS"] = MANUAL_PHONETICS[word]
            entry["phoneticSource"] = "open pronunciation fallback"
            filled += 1
            continue
        pronunciations = pronouncing.phones_for_word(word)
        if not pronunciations:
            continue
        ipa = phones_to_ipa(pronunciations[0])
        if not ipa:
            continue
        entry["phoneticUS"] = ipa
        if not entry.get("phonetic"):
            entry["phonetic"] = ipa
            entry["phoneticSource"] = "CMUdict"
            filled += 1

    payload = json.dumps(entries, ensure_ascii=False, separators=(",", ":"))
    args.vocabulary.write_text(
        "/* Generated from ECDICT and enriched with open CMUdict IPA data. */\n"
        f"window.ENGLISH_BUDDY_VOCABULARY={payload};\n",
        encoding="utf-8",
    )
    print(f"Filled {filled} missing phonetics across {len(entries)} entries")


if __name__ == "__main__":
    main()
