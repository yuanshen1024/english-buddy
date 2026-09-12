#!/usr/bin/env python3
"""Fill missing pronunciation fields with open CMUdict IPA data."""

from __future__ import annotations

import argparse
import gzip
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

LETTER_IPA = {
    "a": "eɪ",
    "b": "biː",
    "c": "siː",
    "d": "diː",
    "e": "iː",
    "f": "ɛf",
    "g": "dʒiː",
    "h": "eɪtʃ",
    "i": "aɪ",
    "j": "dʒeɪ",
    "k": "keɪ",
    "l": "ɛl",
    "m": "ɛm",
    "n": "ɛn",
    "o": "oʊ",
    "p": "piː",
    "q": "kjuː",
    "r": "ɑr",
    "s": "ɛs",
    "t": "tiː",
    "u": "juː",
    "v": "viː",
    "w": "ˈdʌbəljuː",
    "x": "ɛks",
    "y": "waɪ",
    "z": "ziː",
}


def british_variants(word: str) -> list[str]:
    variants = [word]
    replacements = [
        ("isation", "ization"),
        ("isations", "izations"),
        ("ising", "izing"),
        ("ised", "ized"),
        ("ise", "ize"),
        ("yse", "yze"),
        ("ysed", "yzed"),
        ("ysing", "yzing"),
        ("our", "or"),
        ("re", "er"),
        ("ae", "e"),
        ("oe", "e"),
    ]
    for source, target in replacements:
        if source in word:
            variants.append(word.replace(source, target))
    variants.extend(
        [
            word.replace("waggon", "wagon"),
            word.replace("fulfilment", "fulfillment"),
            word.replace("counselling", "counseling"),
            word.replace("gruelling", "grueling"),
            word.replace("lense", "lens"),
            word.replace("reservior", "reservoir"),
        ]
    )
    return list(dict.fromkeys(variant for variant in variants if variant))


def acronym_ipa(word: str) -> str:
    if not word.isalpha() or len(word) > 8:
        return ""
    symbols = [LETTER_IPA.get(letter) for letter in word.lower()]
    if any(not symbol for symbol in symbols):
        return ""
    return f"/{' '.join(symbols)}/"


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
        / "vocabulary.json.gz",
    )
    parser.add_argument(
        "--pronouncing-path",
        type=Path,
        default=Path("/private/tmp/pronouncing_deps"),
    )
    parser.add_argument(
        "--g2p-path",
        type=Path,
        default=Path("/private/tmp/g2p_en_deps"),
    )
    args = parser.parse_args()

    sys.path.insert(0, str(args.pronouncing_path))
    try:
        import pronouncing  # type: ignore
    except Exception:
        pronouncing = None

    g2p = None
    if args.g2p_path.is_dir():
        try:
            sys.path.insert(0, str(args.g2p_path))
            from g2p_en import G2p  # type: ignore

            g2p = G2p()
        except Exception as error:
            print(f"G2P unavailable: {error}")

    if args.vocabulary.suffix == ".gz":
        with gzip.open(args.vocabulary, "rt", encoding="utf-8") as source:
            entries = json.load(source)
    else:
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
        pronunciations = []
        if pronouncing is not None:
            for variant in british_variants(word):
                pronunciations = pronouncing.phones_for_word(variant)
                if pronunciations:
                    break
        if not pronunciations:
            ipa = ""
        else:
            ipa = phones_to_ipa(pronunciations[0])
        if not ipa and g2p is not None:
            try:
                ipa = phones_to_ipa(" ".join(g2p(word)))
            except Exception:
                ipa = ""
        if not ipa:
            ipa = acronym_ipa(word)
        if not ipa:
            continue
        entry["phoneticUS"] = ipa
        if not entry.get("phonetic"):
            entry["phonetic"] = ipa
            entry["phoneticSource"] = "CMUdict"
            filled += 1

    payload = json.dumps(
        entries,
        ensure_ascii=False,
        separators=(",", ":"),
    )
    if args.vocabulary.suffix == ".gz":
        with gzip.open(args.vocabulary, "wt", encoding="utf-8", compresslevel=9) as output:
            output.write(payload)
    else:
        args.vocabulary.write_text(
            "/* Generated from ECDICT and enriched with open CMUdict IPA data. */\n"
            f"window.ENGLISH_BUDDY_VOCABULARY={payload};\n",
            encoding="utf-8",
        )
    print(f"Filled {filled} missing phonetics across {len(entries)} entries")


if __name__ == "__main__":
    main()
