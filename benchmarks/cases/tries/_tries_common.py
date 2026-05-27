from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0208_implement_trie_prefix_tree":
        lines = ["__init__"]
        for index in range(size):
            word = f"word{index}"
            lines.append(f"insert {word}")
            if index % 2 == 0:
                lines.append(f"search {word}")
            if index % 3 == 0:
                lines.append(f"startsWith word{index // 10}")
        return "\n".join(lines) + "\n"
    if problem_id == "0211_design_add_and_search_words_data_structure":
        lines = ["__init__"]
        for index in range(size):
            word = f"bad{index}"
            lines.append(f"addWord {word}")
            if index % 2 == 0:
                lines.append(f"search {word}")
            if index % 5 == 0:
                lines.append("search bad.")
        return "\n".join(lines) + "\n"
    if problem_id == "0212_word_search_ii":
        side = max(2, int(size**0.5))
        board = [chr(ord("a") + ((row + col) % 26)) for row in range(side) for col in range(side)]
        words = []
        for row in range(side):
            first = chr(ord("a") + (row % 26))
            second = chr(ord("a") + ((row + 1) % 26))
            words.append(first + second)
        return f"{len(words)} {side} {side} " + " ".join(words + board) + "\n"
    raise ValueError(f"missing case generator for {problem_id}")
