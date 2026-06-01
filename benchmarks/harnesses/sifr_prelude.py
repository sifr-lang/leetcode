SIFR_PRELUDE = """
from sifr.io import read_text
from sifr.sys import argv, exit

def _bench_nz_str(own value: str | None) -> str:
    if value is None:
        return ""
    return value

def _bench_parse_int(value: str) -> int:
    try:
        parsed: int = int(value)
        return parsed
    except ParseError:
        return 0

def _bench_parse_float(value: str) -> float:
    try:
        parsed: float = float(value)
        return parsed
    except ParseError:
        return 0.0

def _bench_read_required(path: str) -> str:
    try:
        loaded: str = read_text(path)
        return loaded
    except IOError as e:
        print("fixture read failed: " + e.message)
        exit(1)
    return ""

def _bench_copy_list_int(values: list[int]) -> list[int]:
    copied: list[int] = []
    for value in values:
        copied.append(value)
    return copied

def _bench_copy_list_str(values: list[str]) -> list[str]:
    copied: list[str] = []
    for value in values:
        copied.append(value)
    return copied

def _bench_copy_list_float(values: list[float]) -> list[float]:
    copied: list[float] = []
    for value in values:
        copied.append(value)
    return copied

def _bench_copy_matrix_int(values: list[list[int]]) -> list[list[int]]:
    copied: list[list[int]] = []
    for row in values:
        copied_row: list[int] = []
        for value in row:
            copied_row.append(value)
        copied.append(copied_row)
    return copied

def _bench_copy_matrix_str(values: list[list[str]]) -> list[list[str]]:
    copied: list[list[str]] = []
    for row in values:
        copied_row: list[str] = []
        for value in row:
            copied_row.append(value)
        copied.append(copied_row)
    return copied

def _bench_checksum_matrix_int(values: list[list[int]]) -> int:
    total: int = len(values)
    for row in values:
        total = total + len(row)
    return total

def _build_list_node(tokens: list[str], start: int, end: int) -> ListNode | None:
    head: ListNode | None = None
    for index in range(end - 1, start - 1, -1):
        head = ListNode(_bench_parse_int(_bench_nz_str(tokens[index])), head)
    return head

def _expect_list_node(own node: ListNode | None) -> ListNode:
    if node is None:
        return ListNode(0, None)
    return node

def _build_balanced_tree(values: list[int], left: int, right: int) -> TreeNode | None:
    if left > right:
        return None
    mid: int = (left + right) // 2
    value: int | None = values[mid]
    resolved: int = 0
    if value is None:
        resolved = 0
    else:
        resolved = value
    return TreeNode(resolved, _build_balanced_tree(values, left, mid - 1), _build_balanced_tree(values, mid + 1, right))
""".strip()
