#!/usr/bin/env python3
"""Generate 56,800 browser-readable English words and short sentences."""

from __future__ import annotations

import gzip
import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
VOCABULARY_PATH = PROJECT_ROOT / "assets" / "data" / "vocabulary.json.gz"
OUTPUT_PATH = PROJECT_ROOT / "assets" / "data" / "speech-library.json.gz"
TARGET_COUNT = 56_800

FRAMES = [
    ("Please listen to the word “{word}”.", "请听单词“{word}”。", "发音"),
    ("Can you say “{word}” clearly?", "你能清楚地读出“{word}”吗？", "发音"),
    ("I wrote “{word}” in my notebook.", "我在笔记本中写下了“{word}”。", "笔记"),
    ("What does “{word}” mean?", "“{word}”是什么意思？", "提问"),
    ("Use “{word}” in a short sentence.", "请用“{word}”造一个短句。", "造句"),
    ("The word “{word}” is useful in this lesson.", "单词“{word}”在本课中很有用。", "课堂"),
    ("Please repeat after me: {word}.", "请跟我重复：{word}。", "跟读"),
    ("I am learning how to pronounce “{word}”.", "我正在学习“{word}”的发音。", "发音"),
    ("Remember the meaning of “{word}”.", "记住“{word}”的含义。", "记忆"),
    ("Try to use “{word}” when you speak.", "口语表达时试着使用“{word}”。", "口语"),
    ("Can you spell “{word}” without help?", "你能独立拼写“{word}”吗？", "拼写"),
    ("This sentence contains the word “{word}”.", "这个句子包含单词“{word}”。", "阅读"),
    ("Look at “{word}” and read it aloud.", "看“{word}”并大声朗读。", "跟读"),
    ("Do you know another word related to “{word}”?", "你知道与“{word}”相关的另一个词吗？", "词汇"),
    ("Write one example with “{word}”.", "请用“{word}”写一个例句。", "写作"),
    ("I will review “{word}” again tomorrow.", "我明天会再次复习“{word}”。", "复习"),
    ("Say “{word}” slowly, then say it naturally.", "先慢慢读“{word}”，再自然地说一遍。", "发音"),
    ("Listen carefully to the ending of “{word}”.", "仔细听“{word}”的结尾发音。", "听力"),
    ("Can you remember “{word}” without looking?", "你能不看内容想起“{word}”吗？", "记忆"),
    ("This word is new to me: {word}.", "这个词对我来说是新的：{word}。", "词汇"),
    ("I found “{word}” in an English article.", "我在一篇英语文章中看到了“{word}”。", "阅读"),
    ("The teacher explained how to use “{word}”.", "老师讲解了“{word}”的用法。", "课堂"),
    ("Let us compare “{word}” with a similar word.", "让我们把“{word}”和一个近义词进行比较。", "词汇"),
    ("Can you give me an example of “{word}”?", "你能给“{word}”举一个例子吗？", "造句"),
    ("Please say “{word}” one more time.", "请再说一次“{word}”。", "跟读"),
    ("I want to use “{word}” correctly.", "我想正确使用“{word}”。", "口语"),
    ("The pronunciation of “{word}” is important.", "“{word}”的发音很重要。", "发音"),
    ("Do not forget to review “{word}”.", "不要忘记复习“{word}”。", "复习"),
    ("I highlighted “{word}” in my notes.", "我在笔记中高亮了“{word}”。", "笔记"),
    ("Let us practice “{word}” in a conversation.", "让我们在对话中练习“{word}”。", "口语"),
    ("What part of speech is “{word}”?", "“{word}”是什么词性？", "语法"),
    ("Can “{word}” be used in formal writing?", "“{word}”可以用于正式写作吗？", "写作"),
    ("I heard “{word}” in a podcast today.", "我今天在播客中听到了“{word}”。", "听力"),
    ("Try to link “{word}” with a familiar idea.", "试着把“{word}”和熟悉的观点联系起来。", "记忆"),
    ("Read the word “{word}” with the correct stress.", "用正确的重音读出单词“{word}”。", "发音"),
    ("The word “{word}” appears in this paragraph.", "单词“{word}”出现在这一段中。", "阅读"),
    ("Please add “{word}” to your vocabulary list.", "请把“{word}”加入词汇表。", "词汇"),
    ("Can you translate the sentence with “{word}”?", "你能翻译包含“{word}”的句子吗？", "翻译"),
    ("I need more practice with “{word}”.", "我需要更多练习来掌握“{word}”。", "练习"),
    ("Say “{word}” and then use it in context.", "先读“{word}”，再把它放入语境中使用。", "口语"),
    ("This exercise focuses on the word “{word}”.", "这项练习重点训练单词“{word}”。", "训练"),
    ("Listen for “{word}” in the next sentence.", "听下一句话中的“{word}”。", "听力"),
    ("Can you explain “{word}” in simple English?", "你能用简单英语解释“{word}”吗？", "口语"),
    ("I will add “{word}” to my review cards.", "我会把“{word}”加入复习卡片。", "复习"),
    ("Use “{word}” to describe your idea.", "用“{word}”描述你的观点。", "写作"),
    ("Check the spelling of “{word}” carefully.", "仔细检查“{word}”的拼写。", "拼写"),
    ("The word “{word}” has an important meaning.", "单词“{word}”有重要的含义。", "词汇"),
    ("Try reading “{word}” at a natural speed.", "试着用自然语速朗读“{word}”。", "发音"),
    ("I can now recognize the word “{word}”.", "我现在能认出单词“{word}”了。", "进步"),
    ("Practice “{word}” until it feels familiar.", "反复练习“{word}”，直到它变得熟悉。", "练习"),
]

EXCLUDED = {
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "have",
    "will",
    "would",
    "could",
    "should",
    "their",
    "there",
    "what",
    "when",
    "where",
    "which",
    "your",
    "they",
    "you",
    "not",
    "but",
    "his",
    "her",
    "its",
    "our",
    "who",
    "whom",
    "whose",
    "been",
    "being",
    "does",
    "did",
    "doing",
    "done",
    "them",
    "then",
    "than",
    "also",
    "just",
    "only",
    "very",
    "more",
    "most",
}


def main() -> None:
    with gzip.open(VOCABULARY_PATH, "rt", encoding="utf-8") as source:
        vocabulary = json.load(source)

    candidates = []
    seen = set()
    for item in vocabulary:
        word = str(item.get("word") or "").strip().lower()
        meaning = str(item.get("meaning") or "").strip()
        if (
            not word
            or word in seen
            or word in EXCLUDED
            or not re.fullmatch(r"[a-z][a-z'-]{3,14}", word)
            or not meaning
        ):
            continue
        seen.add(word)
        candidates.append(item)

    words_per_frame = TARGET_COUNT // len(FRAMES)
    candidates = sorted(
        candidates,
        key=lambda item: (
            item.get("frequencyRank") or 10_000_000,
            len(str(item.get("word"))),
        ),
    )[:words_per_frame]
    if len(candidates) < words_per_frame:
        raise SystemExit("Not enough vocabulary entries for the speech library.")

    payload = json.dumps(
        {
            "version": 1,
            "targetCount": TARGET_COUNT,
            "words": [
                {
                    "word": str(item["word"]),
                    "meaning": str(item["meaning"]),
                    "deck": item.get("deck") or "高频英语",
                    "frequencyRank": item.get("frequencyRank") or 10_000_000,
                }
                for item in candidates
            ],
            "frames": [
                {
                    "english": english,
                    "chinese": chinese,
                    "category": category,
                }
                for english, chinese, category in FRAMES
            ],
        },
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(OUTPUT_PATH, "wb", compresslevel=9) as output:
        output.write(payload)
    print(
        f"Generated {TARGET_COUNT} speech entries from "
        f"{words_per_frame} words and {len(FRAMES)} frames: {OUTPUT_PATH}"
    )


if __name__ == "__main__":
    main()
