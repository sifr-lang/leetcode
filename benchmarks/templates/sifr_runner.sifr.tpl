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


{{RUNNER_BODY}}
