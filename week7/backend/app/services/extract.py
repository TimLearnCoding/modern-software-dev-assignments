import re

# Patterns for deadline detection (e.g., "by Friday", "due 2024-01-15", "due tomorrow")
_DEADLINE_RE = re.compile(
    r"\b(by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|eod|end of day)"
    r"|due\s+\S+)",
    re.IGNORECASE,
)

# Patterns for @mentions (e.g., "@alice please review")
_MENTION_RE = re.compile(r"@\w+")

# Patterns for priority tags (e.g., "[HIGH]", "[P0]", "[URGENT]")
_PRIORITY_RE = re.compile(r"\[(HIGH|LOW|MEDIUM|URGENT|P[0-3])\]", re.IGNORECASE)

# Keyword prefixes that indicate action items
_ACTION_PREFIXES = ("todo:", "action:", "fixme:", "hack:")


def extract_action_items(text: str) -> list[str]:
    lines = [line.strip("- ") for line in text.splitlines() if line.strip()]
    results: list[str] = []
    for line in lines:
        normalized = line.lower()
        if any(normalized.startswith(prefix) for prefix in _ACTION_PREFIXES):
            results.append(line)
        elif line.endswith("!"):
            results.append(line)
        elif _DEADLINE_RE.search(line):
            results.append(line)
        elif _MENTION_RE.search(line):
            results.append(line)
        elif _PRIORITY_RE.search(line):
            results.append(line)
    return results


