{{ALGORITHM}}

from sifr.io import read_text
from sifr.sys import argv, exit


def _nz_str(own value: str | None) -> str:
    if value is None:
        return ""
    return value


def _parse_int(value: str) -> int:
    try:
        parsed: int = int(value)
        return parsed
    except ParseError:
        return 0


def _read_required(path: str) -> str:
    try:
        loaded: str = read_text(path)
        return loaded
    except IOError as e:
        print("fixture read failed: " + e.message)
        exit(1)
    return ""


def _format_int_list(values: list[int]) -> str:
    text: str = "["
    for index in range(0, len(values)):
        if index > 0:
            text = text + ", "
        text = text + str(_parse_int(str(values[index])))
    return text + "]"


{{RUNNER_BODY}}
