from __future__ import annotations


def format_fold(value: float) -> str:
    if value >= 2:
        return f"{int(value + 0.5)}x"
    text = f"{value:.2f}"
    if text.endswith("00"):
        text = f"{value:.1f}"
    elif text.endswith("0"):
        text = text[:-1]
    return f"{text}x"
