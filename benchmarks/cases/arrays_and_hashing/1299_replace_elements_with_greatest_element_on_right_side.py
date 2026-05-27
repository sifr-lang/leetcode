from __future__ import annotations

import importlib.util
from pathlib import Path

_SPEC = importlib.util.spec_from_file_location('_arrays_common', Path(__file__).with_name('_arrays_common.py'))
_common = importlib.util.module_from_spec(_SPEC)
assert _SPEC.loader is not None
_SPEC.loader.exec_module(_common)


def fixture_stem(size: int) -> str:
    return _common.fixture_stem(size)


def generate_input(size: int) -> str:
    return _common.generate_input('1299_replace_elements_with_greatest_element_on_right_side', size)
