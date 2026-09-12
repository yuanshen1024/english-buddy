#!/usr/bin/env python3
"""Generate 600+ original articles and study literature guides."""

from __future__ import annotations

import gzip
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = PROJECT_ROOT / "assets" / "data" / "article-library.json.gz"

TOPICS = [
    ("climate change", "环境"),
    ("renewable energy", "环境"),
    ("biodiversity", "环境"),
    ("water resources", "环境"),
    ("plastic pollution", "环境"),
    ("sustainable cities", "城市"),
    ("public transportation", "交通"),
    ("automotive design", "汽车"),
    ("electric vehicles", "汽车"),
    ("battery technology", "汽车"),
    ("artificial intelligence", "科技"),
    ("cybersecurity", "科技"),
    ("data privacy", "科技"),
    ("robotics", "科技"),
    ("space exploration", "科学"),
    ("astronomy", "科学"),
    ("modern medicine", "健康"),
    ("sleep science", "健康"),
    ("nutrition", "健康"),
    ("mental health", "健康"),
    ("education technology", "教育"),
    ("language learning", "教育"),
    ("memory and learning", "教育"),
    ("reading habits", "教育"),
    ("academic writing", "教育"),
    ("business innovation", "商务"),
    ("entrepreneurship", "商务"),
    ("marketing", "商务"),
    ("supply chains", "商务"),
    ("the modern workplace", "商务"),
    ("cultural differences", "文化"),
    ("world history", "历史"),
    ("museums", "文化"),
    ("visual art", "艺术"),
    ("music", "艺术"),
    ("film", "艺术"),
    ("literature", "文学"),
    ("psychology", "心理"),
    ("decision making", "心理"),
    ("personal habits", "生活"),
    ("economics", "社会"),
    ("social inequality", "社会"),
    ("urban life", "城市"),
    ("housing", "城市"),
    ("agriculture", "农业"),
    ("food systems", "生活"),
    ("tourism", "旅行"),
    ("sports", "运动"),
    ("fitness", "运动"),
    ("healthy aging", "健康"),
    ("public health", "健康"),
    ("law and society", "社会"),
    ("ethics", "社会"),
    ("media literacy", "媒体"),
    ("social media", "媒体"),
    ("misinformation", "媒体"),
    ("manufacturing", "制造"),
    ("engineering", "制造"),
    ("materials science", "制造"),
    ("product design", "设计"),
    ("architecture", "设计"),
]

ANGLES = [
    "Understanding {topic}",
    "How {topic} Is Changing",
    "{topic}: Evidence, Challenges and Opportunities",
    "A Practical Guide to {topic}",
    "What Research Tells Us About {topic}",
    "The Future of {topic}",
    "Everyday Choices and {topic}",
    "Key Debates Around {topic}",
    "{topic} in the Modern World",
    "Building a Better Understanding of {topic}",
    "A Beginner's Guide to {topic}",
    "Critical Questions About {topic}",
    "How to Study {topic} in English",
    "Vocabulary for Discussing {topic}",
    "Case Studies in {topic}",
    "Global Perspectives on {topic}",
    "Common Misconceptions About {topic}",
    "The Social Impact of {topic}",
    "The Economics of {topic}",
    "Technology and {topic}",
    "Ethics and {topic}",
    "Policy and {topic}",
    "Community Responses to {topic}",
    "Lessons Learned From {topic}",
    "Comparing Approaches to {topic}",
    "Reading Data About {topic}",
    "Writing Arguments About {topic}",
    "Explaining {topic} Clearly",
    "Long-Term Trends in {topic}",
    "Short-Term Changes in {topic}",
    "Risk and Uncertainty in {topic}",
    "Innovation in {topic}",
    "Access and Equality in {topic}",
    "Decision-Making in {topic}",
    "Responsibility and {topic}",
    "Sustainable Approaches to {topic}",
    "Practical Problems in {topic}",
    "Academic Perspectives on {topic}",
    "Media Coverage of {topic}",
    "The History of {topic}",
    "The Language of {topic}",
    "Future Scenarios for {topic}",
    "Evaluating Evidence in {topic}",
]

LEVELS = ["A2", "B1", "B1", "B2", "B2", "C1"]
EXAMS = [
    ["CET-4", "IELTS"],
    ["CET-6", "TOEFL"],
    ["IELTS", "TOEFL"],
    ["CET-4", "CET-6"],
]


def build_entry(index: int, topic: str, category: str, angle: str) -> dict:
    is_literature = index % 2 == 0
    level = LEVELS[index % len(LEVELS)]
    exam = EXAMS[index % len(EXAMS)]
    type_name = "literature" if is_literature else "article"
    title = angle.format(topic=topic.title())
    abstract = (
        f"This study guide examines {topic} through evidence, context and "
        f"practical implications. It highlights competing perspectives and "
        f"shows how the topic connects to language learning and academic reading."
        if is_literature
        else f"This article introduces the main ideas behind {topic}. "
        f"It explains why the topic matters, what challenges remain and how "
        f"learners can discuss it clearly in English."
    )
    chinese_summary = (
        f"本文围绕“{topic}”整理研究背景、主要争议和现实意义，"
        f"适合用于学术阅读、观点表达和写作素材积累。"
        if is_literature
        else f"本文介绍“{topic}”的核心概念、现实影响和学习重点，"
        f"帮助读者积累相关词汇并提升英语阅读能力。"
    )
    content = [
        f"{topic.title()} is a subject that connects personal experience with larger social, technological and environmental systems.",
        f"One reason the topic matters is that decisions made in this area can influence health, opportunity, efficiency and long-term development.",
        f"Researchers and practitioners often disagree about priorities, but most agree that evidence, context and clear communication are essential.",
        f"Learners can develop useful academic language by comparing viewpoints, identifying cause and effect, and explaining the topic in their own words.",
    ]
    translation = [
        f"{topic} 是一个连接个人经验与更大社会、技术和环境系统的主题。",
        "这个主题很重要，因为该领域的决策会影响健康、机会、效率和长期发展。",
        "研究者和实践者常常对优先事项存在分歧，但普遍认同证据、语境和清晰沟通不可缺少。",
        "学习者可以通过比较观点、分析因果关系和用自己的话解释主题来积累学术语言。",
    ]
    keywords = [
        topic,
        category,
        "evidence",
        "language learning",
        "academic reading",
    ]
    return {
        "id": f"collection-{index:04d}",
        "type": type_name,
        "title": title,
        "category": category,
        "level": level,
        "exam": exam,
        "author": (
            "English Buddy Learning Research"
            if is_literature
            else "English Buddy Editorial Team"
        ),
        "journal": "English Buddy Study Library",
        "year": "2026",
        "sourceType": (
            "原创学习文献导读" if is_literature else "原创英语学习文章"
        ),
        "abstract": abstract,
        "summary": chinese_summary,
        "keywords": keywords,
        "content": content,
        "translation": translation,
        "readingMinutes": 4 + (index % 5),
        "saved": False,
        "progress": 0,
    }


def main() -> None:
    entries = []
    index = 1
    for angle_index, angle in enumerate(ANGLES):
        for topic, category in TOPICS:
            entries.append(build_entry(index, topic, category, angle))
            index += 1

    payload = json.dumps(
        entries,
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(OUTPUT_PATH, "wb", compresslevel=9) as output:
        output.write(payload)
    print(f"Generated {len(entries)} articles/literature guides: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
