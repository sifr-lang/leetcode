# LeetCode 179: Largest Number
# Python version

def repeatKey(value: str) -> str:
    return value * 10

def largestNumber(nums: list[int]) -> str:
    values: list[str] = []
    for n in nums:
        values.append(str(n))

    values = sorted(values, key=repeatKey)
    values.reverse()
    joined = "".join(values)

    k = 0
    while k + 1 < len(joined) and joined[k] == "0":
        k += 1
    return joined[k:]

def main():
    assert largestNumber([10, 2],) == "210"
    assert largestNumber([3, 30, 34, 5, 9],) == "9534330"

if __name__ == "__main__":
    main()
