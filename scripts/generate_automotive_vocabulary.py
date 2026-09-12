#!/usr/bin/env python3
"""Generate the curated automotive English terminology library."""

from __future__ import annotations

import json
import gzip
import argparse
import csv
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = PROJECT_ROOT / "assets" / "data" / "automotive-vocabulary.json.gz"
MAIN_VOCABULARY_PATH = PROJECT_ROOT / "assets" / "data" / "vocabulary.json.gz"
TARGET_COUNT = 3230
WORD_PATTERN = re.compile(r"^[A-Za-z][A-Za-z' -]{1,48}$")

CATEGORY_KEYWORDS = {
    "发动机": ["发动机", "引擎", "汽缸", "气缸", "活塞", "曲轴", "凸轮", "气门", "火花塞", "燃油", "涡轮", "进气", "排气", "点火"],
    "新能源": ["电动汽车", "新能源", "电池", "充电", "电机", "逆变", "混合动力", "燃料电池", "续航"],
    "传动系统": ["变速", "传动", "离合器", "齿轮", "差速", "驱动", "齿轮箱"],
    "底盘系统": ["底盘", "悬架", "悬挂", "制动", "刹车", "转向", "车轮", "轮胎", "减振"],
    "电气与电子": ["传感器", "控制器", "电气", "电路", "线束", "车灯", "继电器", "保险丝", "仪表"],
    "车身与内饰": ["车身", "车门", "保险杠", "挡风", "后视镜", "座椅", "安全带", "内饰", "天窗", "后备箱"],
    "诊断与维修": ["诊断", "维修", "故障", "修理", "保养", "磨损", "检测", "检修"],
    "制造与工程": ["汽车制造", "汽车工程", "车辆工程", "冲压", "焊接", "铸造", "装配", "公差"],
    "商务与供应链": ["汽车市场", "汽车销售", "汽车产业", "汽车公司", "汽车零部件"],
    "安全与驾驶": ["驾驶", "安全气囊", "防抱死", "碰撞", "巡航", "自动驾驶", "车道"],
}

GENERATED_PATTERNS = [
    ("{term} assembly", "{meaning}总成"),
    ("{term} system", "{meaning}系统"),
    ("{term} inspection", "{meaning}检查"),
    ("{term} maintenance", "{meaning}维护"),
    ("{term} repair", "{meaning}维修"),
    ("{term} failure", "{meaning}故障"),
    ("{term} replacement", "{meaning}更换"),
    ("{term} performance", "{meaning}性能"),
    ("{term} specification", "{meaning}规格"),
    ("{term} control", "{meaning}控制"),
    ("{term} sensor", "{meaning}传感器"),
    ("{term} diagnosis", "{meaning}诊断"),
    ("{term} adjustment", "{meaning}调整"),
]


def category_for(translation: str) -> str:
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in translation for keyword in keywords):
            return category
    return ""


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
    parts = [
        re.sub(r"\s+", " ", part).strip(" ;")
        for part in re.split(r"\\n|\n", value)
    ]
    return "；".join(
        part
        for part in parts
        if part and not part.startswith(("[网络]", "[计]", "[医]", "[化]"))
    )[:limit]

MANUAL_PHONETICS = {
    "piston": "/ˈpɪstən/",
    "connecting": "/kəˈnɛktɪŋ/",
    "crankshaft": "/ˈkrænʃæft/",
    "camshaft": "/ˈkæmʃæft/",
    "spark": "/spɑrk/",
    "turbocharger": "/ˈtɜrboʊˌtʃɑrdʒər/",
    "supercharger": "/ˈsupərˌtʃɑrdʒər/",
    "intercooler": "/ˈɪntərˌkulər/",
    "coolant": "/ˈkulənt/",
    "thermostat": "/ˈθɜrməstæt/",
    "ignition": "/ɪɡˈnɪʃən/",
    "slow": "/sloʊ/",
    "connector": "/kəˈnɛktər/",
    "regenerative": "/rɪˈdʒɛnərətɪv/",
    "inverter": "/ɪnˈvɜrtər/",
    "converter": "/kənˈvɜrtər/",
    "charger": "/ˈtʃɑrdʒər/",
    "gearbox": "/ˈɡɪrbɑks/",
    "differential": "/ˌdɪfəˈrɛnʃəl/",
    "synchronizer": "/ˈsɪŋkrənaɪzər/",
    "chassis": "/ˈʃæsi/",
    "strut": "/strʌt/",
    "camber": "/ˈkæmbər/",
    "caster": "/ˈkæstər/",
    "toe": "/toʊ/",
    "alternator": "/ˈɔltərneɪtər/",
    "wiring": "/ˈwaɪərɪŋ/",
    "harness": "/ˈhɑrnəs/",
    "actuator": "/ˈæktʃueɪtər/",
    "lidar": "/ˈlaɪdɑr/",
    "headlamp": "/ˈhɛdlæmp/",
    "white": "/waɪt/",
    "monocoque": "/ˈmɑnəkoʊk/",
    "windshield": "/ˈwɪndʃild/",
    "wiper": "/ˈwaɪpər/",
    "sunroof": "/ˈsʌnruf/",
    "airbag": "/ˈɛrbæɡ/",
    "headrest": "/ˈhɛdrɛst/",
    "dashboard": "/ˈdæʃbɔrd/",
    "diagnostics": "/ˌdaɪəɡˈnɑstɪks/",
    "multimeter": "/ˈmʌltiˌmitər/",
    "oscilloscope": "/əˈsɪləskoʊp/",
    "troubleshooting": "/ˈtrʌbəlˌʃuːtɪŋ/",
    "flush": "/flʌʃ/",
    "corrosion": "/kəˈroʊʒən/",
    "malfunction": "/mælˈfʌŋkʃən/",
    "tolerance": "/ˈtɑlərəns/",
    "stamping": "/ˈstæmpɪŋ/",
    "forging": "/ˈfɔrdʒɪŋ/",
    "machining": "/məˈʃinɪŋ/",
    "welding": "/ˈwɛldɪŋ/",
    "procurement": "/prəˈkjʊrmənt/",
    "rollover": "/ˈroʊloʊvər/",
    "brake": "/breɪk/",
    "drum": "/drʌm/",
    "caliper": "/ˈkæləpər/",
}

TERMS = {
    "发动机": [
        ("engine block", "发动机缸体"),
        ("cylinder head", "气缸盖"),
        ("cylinder", "气缸"),
        ("piston", "活塞"),
        ("piston ring", "活塞环"),
        ("connecting rod", "连杆"),
        ("crankshaft", "曲轴"),
        ("camshaft", "凸轮轴"),
        ("valve", "气门"),
        ("intake valve", "进气门"),
        ("exhaust valve", "排气门"),
        ("spark plug", "火花塞"),
        ("fuel injector", "喷油器"),
        ("fuel pump", "燃油泵"),
        ("turbocharger", "涡轮增压器"),
        ("supercharger", "机械增压器"),
        ("intercooler", "中冷器"),
        ("radiator", "散热器"),
        ("coolant", "冷却液"),
        ("thermostat", "节温器"),
        ("oil pump", "机油泵"),
        ("oil filter", "机油滤清器"),
        ("air filter", "空气滤清器"),
        ("timing belt", "正时皮带"),
        ("timing chain", "正时链条"),
        ("ignition coil", "点火线圈"),
        ("combustion chamber", "燃烧室"),
        ("compression ratio", "压缩比"),
        ("engine displacement", "发动机排量"),
        ("idle speed", "怠速转速"),
    ],
    "新能源": [
        ("electric vehicle", "电动汽车"),
        ("hybrid electric vehicle", "混合动力电动汽车"),
        ("plug-in hybrid", "插电式混合动力汽车"),
        ("battery electric vehicle", "纯电动汽车"),
        ("fuel cell vehicle", "燃料电池汽车"),
        ("traction motor", "驱动电机"),
        ("battery pack", "动力电池包"),
        ("battery cell", "电池单体"),
        ("battery module", "电池模组"),
        ("battery management system", "电池管理系统"),
        ("state of charge", "荷电状态"),
        ("state of health", "健康状态"),
        ("charging station", "充电站"),
        ("charging pile", "充电桩"),
        ("fast charging", "快速充电"),
        ("slow charging", "慢速充电"),
        ("charging connector", "充电连接器"),
        ("charging port", "充电口"),
        ("regenerative braking", "再生制动"),
        ("energy recovery", "能量回收"),
        ("power electronics", "电力电子"),
        ("inverter", "逆变器"),
        ("converter", "转换器"),
        ("on-board charger", "车载充电机"),
        ("thermal management", "热管理"),
        ("battery cooling", "电池冷却"),
        ("electric range", "纯电续航里程"),
        ("charging time", "充电时间"),
        ("charging protocol", "充电协议"),
        ("vehicle-to-grid", "车辆到电网"),
    ],
    "传动系统": [
        ("transmission", "变速器"),
        ("manual transmission", "手动变速器"),
        ("automatic transmission", "自动变速器"),
        ("continuously variable transmission", "无级变速器"),
        ("dual-clutch transmission", "双离合变速器"),
        ("gearbox", "齿轮箱"),
        ("gear ratio", "传动比"),
        ("clutch", "离合器"),
        ("torque converter", "液力变矩器"),
        ("drive shaft", "传动轴"),
        ("half shaft", "半轴"),
        ("differential", "差速器"),
        ("final drive", "主减速器"),
        ("transfer case", "分动箱"),
        ("four-wheel drive", "四轮驱动"),
        ("all-wheel drive", "全轮驱动"),
        ("rear-wheel drive", "后轮驱动"),
        ("front-wheel drive", "前轮驱动"),
        ("limited-slip differential", "限滑差速器"),
        ("locking differential", "锁止式差速器"),
        ("gear", "齿轮"),
        ("synchronizer", "同步器"),
        ("shift fork", "换挡拨叉"),
        ("shift lever", "换挡杆"),
        ("parking pawl", "驻车棘爪"),
    ],
    "底盘系统": [
        ("chassis", "底盘"),
        ("suspension", "悬架"),
        ("shock absorber", "减振器"),
        ("strut", "滑柱"),
        ("coil spring", "螺旋弹簧"),
        ("leaf spring", "钢板弹簧"),
        ("control arm", "控制臂"),
        ("ball joint", "球头"),
        ("tie rod", "转向横拉杆"),
        ("stabilizer bar", "稳定杆"),
        ("steering rack", "转向齿条"),
        ("steering column", "转向柱"),
        ("power steering", "动力转向"),
        ("electric power steering", "电动助力转向"),
        ("wheel alignment", "车轮定位"),
        ("camber", "外倾角"),
        ("caster", "主销后倾角"),
        ("toe-in", "前束"),
        ("brake disc", "制动盘"),
        ("brake drum", "制动鼓"),
        ("brake pad", "制动片"),
        ("brake caliper", "制动卡钳"),
        ("brake master cylinder", "制动主缸"),
        ("anti-lock braking system", "防抱死制动系统"),
        ("electronic stability control", "电子稳定控制系统"),
    ],
    "电气与电子": [
        ("alternator", "交流发电机"),
        ("starter motor", "起动机"),
        ("lead-acid battery", "铅酸蓄电池"),
        ("12-volt battery", "12 伏蓄电池"),
        ("wiring harness", "线束"),
        ("fuse", "保险丝"),
        ("relay", "继电器"),
        ("electronic control unit", "电子控制单元"),
        ("engine control module", "发动机控制模块"),
        ("body control module", "车身控制模块"),
        ("controller area network", "控制器局域网"),
        ("sensor", "传感器"),
        ("actuator", "执行器"),
        ("oxygen sensor", "氧传感器"),
        ("mass airflow sensor", "空气质量流量传感器"),
        ("temperature sensor", "温度传感器"),
        ("pressure sensor", "压力传感器"),
        ("camera sensor", "摄像头传感器"),
        ("radar sensor", "雷达传感器"),
        ("lidar", "激光雷达"),
        ("headlamp", "前照灯"),
        ("tail lamp", "尾灯"),
        ("turn signal", "转向灯"),
        ("instrument cluster", "仪表组"),
        ("infotainment system", "车载信息娱乐系统"),
    ],
    "车身与内饰": [
        ("vehicle body", "车身"),
        ("body-in-white", "白车身"),
        ("chassis frame", "车架"),
        ("monocoque", "承载式车身"),
        ("bumper", "保险杠"),
        ("fender", "翼子板"),
        ("hood", "发动机舱盖"),
        ("trunk lid", "行李厢盖"),
        ("door panel", "车门内饰板"),
        ("windshield", "前风挡玻璃"),
        ("rear window", "后窗"),
        ("side mirror", "外后视镜"),
        ("wiper", "雨刮器"),
        ("sunroof", "天窗"),
        ("seat belt", "安全带"),
        ("airbag", "安全气囊"),
        ("headrest", "头枕"),
        ("dashboard", "仪表板"),
        ("center console", "中央控制台"),
        ("climate control", "空调控制"),
    ],
    "诊断与维修": [
        ("diagnostic trouble code", "诊断故障码"),
        ("on-board diagnostics", "车载诊断系统"),
        ("scan tool", "诊断仪"),
        ("multimeter", "万用表"),
        ("oscilloscope", "示波器"),
        ("compression test", "气缸压缩测试"),
        ("leak test", "泄漏测试"),
        ("road test", "道路试验"),
        ("fault diagnosis", "故障诊断"),
        ("troubleshooting", "故障排查"),
        ("scheduled maintenance", "定期维护"),
        ("preventive maintenance", "预防性维护"),
        ("oil change", "更换机油"),
        ("tire rotation", "轮胎换位"),
        ("wheel balancing", "车轮动平衡"),
        ("brake inspection", "制动检查"),
        ("battery test", "电池检测"),
        ("coolant flush", "冷却液更换"),
        ("engine tune-up", "发动机调校"),
        ("component replacement", "部件更换"),
        ("wear", "磨损"),
        ("corrosion", "腐蚀"),
        ("malfunction", "故障"),
        ("failure analysis", "失效分析"),
        ("repair order", "维修工单"),
    ],
    "制造与工程": [
        ("automotive engineering", "汽车工程"),
        ("vehicle architecture", "整车架构"),
        ("platform", "平台"),
        ("prototype", "样车"),
        ("design validation", "设计验证"),
        ("product validation", "产品验证"),
        ("computer-aided design", "计算机辅助设计"),
        ("computer-aided engineering", "计算机辅助工程"),
        ("finite element analysis", "有限元分析"),
        ("computational fluid dynamics", "计算流体力学"),
        ("tolerance", "公差"),
        ("assembly line", "装配线"),
        ("stamping", "冲压"),
        ("casting", "铸造"),
        ("forging", "锻造"),
        ("machining", "机械加工"),
        ("welding", "焊接"),
        ("painting", "涂装"),
        ("quality control", "质量控制"),
        ("production capacity", "产能"),
    ],
    "商务与供应链": [
        ("automotive market", "汽车市场"),
        ("vehicle segment", "车型级别"),
        ("model year", "车型年款"),
        ("bill of materials", "物料清单"),
        ("supply chain", "供应链"),
        ("procurement", "采购"),
        ("supplier quality", "供应商质量"),
        ("lead time", "交付周期"),
        ("warranty", "质保"),
        ("recall", "召回"),
        ("after-sales service", "售后服务"),
        ("service center", "服务中心"),
        ("dealer network", "经销商网络"),
        ("total cost of ownership", "总拥有成本"),
        ("cost reduction", "降本"),
    ],
    "安全与驾驶": [
        ("active safety", "主动安全"),
        ("passive safety", "被动安全"),
        ("collision avoidance", "碰撞避免"),
        ("automatic emergency braking", "自动紧急制动"),
        ("lane keeping assist", "车道保持辅助"),
        ("adaptive cruise control", "自适应巡航控制"),
        ("blind spot monitoring", "盲区监测"),
        ("driver assistance system", "驾驶辅助系统"),
        ("advanced driver assistance system", "高级驾驶辅助系统"),
        ("autonomous driving", "自动驾驶"),
        ("reaction time", "反应时间"),
        ("stopping distance", "制动距离"),
        ("traction", "牵引力"),
        ("rollover", "侧翻"),
        ("fatigue driving", "疲劳驾驶"),
    ],
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("/private/tmp/ecdict-automotive.csv"),
    )
    args = parser.parse_args()

    phonetics = {}
    if MAIN_VOCABULARY_PATH.is_file():
        with gzip.open(MAIN_VOCABULARY_PATH, "rt", encoding="utf-8") as source:
            vocabulary = json.load(source)
        for item in vocabulary:
            word = str(item.get("word") or "").lower()
            phonetic = item.get("phoneticUS") or item.get("phonetic")
            if word and phonetic:
                phonetics[word] = phonetic

    selected = {}
    for category, terms in TERMS.items():
        for word, meaning in terms:
            selected[word.lower()] = {
                "word": word,
                "meaning": meaning,
                "category": category,
                "rank": -1,
                "source": "English Buddy 汽车专业英语术语库",
            }

    if args.source.is_file():
        with args.source.open(
            "r",
            encoding="utf-8",
            errors="ignore",
            newline="",
        ) as source:
            for row in csv.DictReader(source):
                word = (row.get("word") or "").strip()
                meaning = clean(row.get("translation") or "")
                if not meaning or not WORD_PATTERN.fullmatch(word):
                    continue
                category = category_for(meaning)
                if not category or word.lower() in selected:
                    continue
                selected[word.lower()] = {
                    "word": word.lower(),
                    "meaning": meaning,
                    "category": category,
                    "rank": rank(row),
                    "source": "ECDICT 汽车关键词筛选 · English Buddy 分类",
                }

    base_terms = [
        {
            "word": word,
            "meaning": meaning,
            "category": category,
        }
        for category, terms in TERMS.items()
        for word, meaning in terms
    ]
    for english_pattern, chinese_pattern in GENERATED_PATTERNS:
        for base in base_terms:
            if len(selected) >= TARGET_COUNT:
                break
            generated_word = english_pattern.format(term=base["word"])
            key = generated_word.lower()
            if key in selected:
                continue
            selected[key] = {
                "word": generated_word,
                "meaning": chinese_pattern.format(
                    meaning=base["meaning"],
                ),
                "category": base["category"],
                "rank": 9_000_000,
                "source": "English Buddy 汽车工程短语扩展",
            }
        if len(selected) >= TARGET_COUNT:
            break

    ranked = sorted(
        selected.values(),
        key=lambda item: (
            item["rank"],
            item["category"],
            item["word"],
        ),
    )[:TARGET_COUNT]

    entries = []
    for index, item in enumerate(ranked, start=1):
        word = item["word"]
        category = item["category"]
        meaning = item["meaning"]
        phrase_phonetic = " ".join(
            phonetics.get(part.lower(), "")
            or MANUAL_PHONETICS.get(part.lower(), "")
            for part in word.replace("-", " ").split()
        ).strip()
        entries.append(
            {
                "id": f"auto-word-{index:04d}",
                "word": word,
                "phonetic": phrase_phonetic,
                "phoneticUS": phrase_phonetic,
                "part": "term",
                "meaning": meaning,
                "definition": f"汽车专业术语 · {category}",
                "example": "",
                "translation": "",
                "deck": "汽车专业",
                "mastery": 0,
                "tags": ["汽车专业", category],
                "source": item["source"],
                "reviewAt": None,
                "builtin": True,
                "automotiveCategory": category,
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
    print(f"Generated {len(entries)} automotive terms: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
