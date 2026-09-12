#!/usr/bin/env python3
"""Generate a 3,000-entry business English glossary."""

from __future__ import annotations

import csv
import gzip
import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = PROJECT_ROOT / "assets" / "data" / "business-vocabulary.json.gz"
MAIN_VOCABULARY_PATH = PROJECT_ROOT / "assets" / "data" / "vocabulary.json.gz"
TARGET_COUNT = 3000
WORD_PATTERN = re.compile(r"^[A-Za-z][A-Za-z' -]{1,48}$")

CATEGORY_KEYWORDS = {
    "财务金融": ["财务", "金融", "会计", "投资", "银行", "资本", "利率", "股票", "债券", "现金", "税", "审计", "利润", "成本", "预算", "资产", "负债"],
    "市场营销": ["市场", "营销", "销售", "品牌", "广告", "消费者", "客户", "渠道", "定价", "促销", "需求"],
    "经营管理": ["管理", "经营", "战略", "组织", "绩效", "领导", "决策", "规划"],
    "供应链采购": ["供应链", "采购", "物流", "库存", "供应商", "配送", "制造", "运营", "仓储"],
    "人力资源": ["人力", "招聘", "员工", "薪酬", "培训", "劳动", "岗位", "绩效"],
    "国际贸易": ["贸易", "出口", "进口", "关税", "海关", "国际商务", "汇率"],
    "商务法律": ["合同", "法律", "法规", "合规", "知识产权", "协议", "争议", "仲裁"],
    "创业融资": ["创业", "企业", "公司", "商业", "商务", "融资", "合伙", "商业计划"],
    "商务沟通": ["沟通", "会议", "谈判", "邮件", "报告", "展示", "演讲", "议程", "客户服务"],
    "经济政策": ["经济", "宏观经济", "微观经济", "通胀", "通货膨胀", "失业", "政策", "国内生产总值"],
}

CURATED = [
    ("business model", "商业模式", "创业融资"),
    ("business plan", "商业计划", "创业融资"),
    ("business strategy", "经营战略", "经营管理"),
    ("business process", "业务流程", "经营管理"),
    ("business intelligence", "商业智能", "经营管理"),
    ("business development", "业务拓展", "经营管理"),
    ("business partner", "商业伙伴", "创业融资"),
    ("business ethics", "商业伦理", "商务法律"),
    ("cash flow", "现金流", "财务金融"),
    ("net profit", "净利润", "财务金融"),
    ("gross profit", "毛利润", "财务金融"),
    ("profit margin", "利润率", "财务金融"),
    ("operating cost", "运营成本", "财务金融"),
    ("fixed cost", "固定成本", "财务金融"),
    ("variable cost", "可变成本", "财务金融"),
    ("break-even point", "盈亏平衡点", "财务金融"),
    ("return on investment", "投资回报率", "财务金融"),
    ("return on equity", "净资产收益率", "财务金融"),
    ("balance sheet", "资产负债表", "财务金融"),
    ("income statement", "利润表", "财务金融"),
    ("cash flow statement", "现金流量表", "财务金融"),
    ("accounts payable", "应付账款", "财务金融"),
    ("accounts receivable", "应收账款", "财务金融"),
    ("working capital", "营运资金", "财务金融"),
    ("capital expenditure", "资本支出", "财务金融"),
    ("financial statement", "财务报表", "财务金融"),
    ("financial performance", "财务表现", "财务金融"),
    ("financial risk", "财务风险", "财务金融"),
    ("financial planning", "财务规划", "财务金融"),
    ("cost accounting", "成本会计", "财务金融"),
    ("management accounting", "管理会计", "财务金融"),
    ("tax liability", "纳税义务", "财务金融"),
    ("interest rate", "利率", "财务金融"),
    ("exchange rate", "汇率", "财务金融"),
    ("foreign exchange", "外汇", "财务金融"),
    ("shareholder value", "股东价值", "财务金融"),
    ("market share", "市场份额", "市场营销"),
    ("target market", "目标市场", "市场营销"),
    ("market research", "市场调研", "市场营销"),
    ("market segmentation", "市场细分", "市场营销"),
    ("brand awareness", "品牌知名度", "市场营销"),
    ("brand loyalty", "品牌忠诚度", "市场营销"),
    ("customer journey", "客户旅程", "市场营销"),
    ("customer retention", "客户留存", "市场营销"),
    ("customer acquisition", "客户获取", "市场营销"),
    ("customer satisfaction", "客户满意度", "市场营销"),
    ("customer relationship management", "客户关系管理", "市场营销"),
    ("value proposition", "价值主张", "市场营销"),
    ("unique selling proposition", "独特卖点", "市场营销"),
    ("digital marketing", "数字营销", "市场营销"),
    ("content marketing", "内容营销", "市场营销"),
    ("social media marketing", "社交媒体营销", "市场营销"),
    ("search engine optimization", "搜索引擎优化", "市场营销"),
    ("conversion rate", "转化率", "市场营销"),
    ("sales funnel", "销售漏斗", "市场营销"),
    ("sales forecast", "销售预测", "市场营销"),
    ("sales pipeline", "销售管道", "市场营销"),
    ("lead generation", "潜在客户开发", "市场营销"),
    ("pricing strategy", "定价策略", "市场营销"),
    ("product launch", "产品发布", "市场营销"),
    ("product portfolio", "产品组合", "市场营销"),
    ("key performance indicator", "关键绩效指标", "经营管理"),
    ("strategic planning", "战略规划", "经营管理"),
    ("strategic objective", "战略目标", "经营管理"),
    ("core competency", "核心竞争力", "经营管理"),
    ("competitive advantage", "竞争优势", "经营管理"),
    ("competitive analysis", "竞争分析", "经营管理"),
    ("corporate governance", "公司治理", "经营管理"),
    ("organizational structure", "组织结构", "经营管理"),
    ("organizational culture", "组织文化", "经营管理"),
    ("decision-making process", "决策流程", "经营管理"),
    ("performance management", "绩效管理", "经营管理"),
    ("change management", "变革管理", "经营管理"),
    ("risk management", "风险管理", "经营管理"),
    ("project management", "项目管理", "经营管理"),
    ("project milestone", "项目里程碑", "经营管理"),
    ("project scope", "项目范围", "经营管理"),
    ("supply chain management", "供应链管理", "供应链采购"),
    ("supply chain disruption", "供应链中断", "供应链采购"),
    ("inventory management", "库存管理", "供应链采购"),
    ("inventory turnover", "库存周转率", "供应链采购"),
    ("just-in-time inventory", "准时制库存", "供应链采购"),
    ("lead time", "交付周期", "供应链采购"),
    ("order fulfillment", "订单履行", "供应链采购"),
    ("procurement process", "采购流程", "供应链采购"),
    ("purchase order", "采购订单", "供应链采购"),
    ("supplier relationship", "供应商关系", "供应链采购"),
    ("supplier evaluation", "供应商评估", "供应链采购"),
    ("logistics management", "物流管理", "供应链采购"),
    ("distribution channel", "分销渠道", "供应链采购"),
    ("warehouse management", "仓储管理", "供应链采购"),
    ("quality assurance", "质量保证", "供应链采购"),
    ("quality control", "质量控制", "供应链采购"),
    ("human resources", "人力资源", "人力资源"),
    ("human capital", "人力资本", "人力资源"),
    ("job description", "职位描述", "人力资源"),
    ("job satisfaction", "工作满意度", "人力资源"),
    ("employee engagement", "员工敬业度", "人力资源"),
    ("employee turnover", "员工流失率", "人力资源"),
    ("performance appraisal", "绩效评估", "人力资源"),
    ("compensation package", "薪酬方案", "人力资源"),
    ("talent management", "人才管理", "人力资源"),
    ("succession planning", "继任计划", "人力资源"),
    ("professional development", "职业发展", "人力资源"),
    ("labor market", "劳动力市场", "人力资源"),
    ("collective bargaining", "集体谈判", "人力资源"),
    ("international trade", "国际贸易", "国际贸易"),
    ("free trade", "自由贸易", "国际贸易"),
    ("trade deficit", "贸易逆差", "国际贸易"),
    ("trade surplus", "贸易顺差", "国际贸易"),
    ("trade barrier", "贸易壁垒", "国际贸易"),
    ("import duty", "进口关税", "国际贸易"),
    ("export license", "出口许可证", "国际贸易"),
    ("letter of credit", "信用证", "国际贸易"),
    ("bill of lading", "提货单", "国际贸易"),
    ("customs clearance", "清关", "国际贸易"),
    ("international business", "国际商务", "国际贸易"),
    ("foreign direct investment", "外商直接投资", "国际贸易"),
    ("legal entity", "法律主体", "商务法律"),
    ("legal obligation", "法律义务", "商务法律"),
    ("contract negotiation", "合同谈判", "商务法律"),
    ("contract clause", "合同条款", "商务法律"),
    ("breach of contract", "违约", "商务法律"),
    ("intellectual property", "知识产权", "商务法律"),
    ("trademark", "商标", "商务法律"),
    ("copyright", "版权", "商务法律"),
    ("patent", "专利", "商务法律"),
    ("regulatory compliance", "法规合规", "商务法律"),
    ("dispute resolution", "争议解决", "商务法律"),
    ("business communication", "商务沟通", "商务沟通"),
    ("business meeting", "商务会议", "商务沟通"),
    ("meeting agenda", "会议议程", "商务沟通"),
    ("meeting minutes", "会议纪要", "商务沟通"),
    ("action item", "行动事项", "商务沟通"),
    ("follow-up email", "跟进邮件", "商务沟通"),
    ("business presentation", "商务演示", "商务沟通"),
    ("executive summary", "执行摘要", "商务沟通"),
    ("negotiation strategy", "谈判策略", "商务沟通"),
    ("win-win solution", "双赢方案", "商务沟通"),
]


def category_for(translation: str) -> str:
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword.lower() in translation.lower() for keyword in keywords):
            return category
    return "综合商务"


def rank(row: dict[str, str]) -> int:
    values = []
    for key in ("frq", "bnc"):
        try:
            value = int(row.get(key) or 0)
        except ValueError:
            value = 0
        if value > 0:
            values.append(value)
    return min(values) if values else 10_000_000


def clean(value: str, limit: int = 220) -> str:
    value = (value or "").replace("\r", " ")
    pieces = [
        re.sub(r"\s+", " ", part).strip(" ;")
        for part in re.split(r"\\n|\n", value)
    ]
    return "；".join(
        part
        for part in pieces
        if part and not part.startswith(("[网络]", "[计]", "[医]", "[化]"))
    )[:limit]


def main() -> None:
    phonetics = {}
    if MAIN_VOCABULARY_PATH.is_file():
        with gzip.open(MAIN_VOCABULARY_PATH, "rt", encoding="utf-8") as source:
            for item in json.load(source):
                word = str(item.get("word") or "").lower()
                phonetic = item.get("phoneticUS") or item.get("phonetic")
                if word and phonetic:
                    phonetics[word] = phonetic

    selected: dict[str, dict] = {}
    for word, meaning, category in CURATED:
        key = word.lower()
        selected[key] = {
            "word": word,
            "meaning": meaning,
            "category": category,
            "rank": -1,
        }

    with Path("/private/tmp/ecdict-business.csv").open(
        "r",
        encoding="utf-8",
        errors="ignore",
        newline="",
    ) as source:
        for row in csv.DictReader(source):
            word = (row.get("word") or "").strip()
            translation = clean(row.get("translation") or "")
            if (
                not translation
                or not WORD_PATTERN.fullmatch(word)
                or len(word) > 50
            ):
                continue
            category = category_for(translation)
            if category == "综合商务":
                continue
            key = word.lower()
            if key in selected:
                continue
            selected[key] = {
                "word": word.lower(),
                "meaning": translation,
                "category": category,
                "rank": rank(row),
            }

    ranked = sorted(
        selected.values(),
        key=lambda item: (
            item["rank"],
            str(item["category"]),
            str(item["word"]),
        ),
    )[:TARGET_COUNT]

    entries = []
    for index, item in enumerate(ranked, start=1):
        word = item["word"]
        phonetic = phonetics.get(word) or " ".join(
            phonetics.get(part, "") for part in word.replace("-", " ").split()
        ).strip()
        entries.append(
            {
                "id": f"business-word-{index:04d}",
                "word": word,
                "phonetic": phonetic,
                "phoneticUS": phonetic,
                "part": "term",
                "meaning": item["meaning"],
                "definition": f"商务英语术语 · {item['category']}",
                "example": "",
                "translation": "",
                "deck": "商务英语",
                "mastery": 0,
                "tags": ["商务英语", item["category"]],
                "source": "ECDICT 商务词频筛选 · English Buddy 专业分类",
                "reviewAt": None,
                "builtin": True,
                "businessCategory": item["category"],
            }
        )

    payload = json.dumps(
        entries,
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(OUTPUT_PATH, "wb", compresslevel=9) as output:
        output.write(payload)
    print(f"Generated {len(entries)} business terms: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
