from __future__ import annotations

import importlib.util
from pathlib import Path

_SPEC = importlib.util.spec_from_file_location('_sliding_window_common', Path(__file__).with_name('_sliding_window_common.py'))
_common = importlib.util.module_from_spec(_SPEC)
assert _SPEC.loader is not None
_SPEC.loader.exec_module(_common)


def fixture_stem(size: int) -> str:
    return _common.fixture_stem(size)


def generate_input(size: int) -> str:
    return _common.generate_input('1456_maximum_number_of_vowels_in_a_substring_of_given_length', size)
