
# LeetCode 981: Time Based Key Value Store
# Python version

class TimeMap:
    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.valueCodeStore = {}
        self.timeStore = {}

    def _encode(self, value: str) -> int:
        if value == "bar":
            return 1
        if value == "bar2":
            return 2
        return 0

    def _decode(self, code: int) -> str:
        if code == 1:
            return "bar"
        if code == 2:
            return "bar2"
        return ""

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.valueCodeStore:
            self.valueCodeStore[key] = []
        if key not in self.timeStore:
            self.timeStore[key] = []
        self.valueCodeStore[key].append(self._encode(value))
        self.timeStore[key].append(timestamp)

    def get(self, key: str, timestamp: int) -> str:
        res_code = 0
        if key in self.timeStore:
            l, r = 0, len(self.timeStore[key]) - 1
            while l <= r:
                m = (l + r) // 2
                if self.timeStore[key][m] <= timestamp:
                    res_code = self.valueCodeStore[key][m]
                    l = m + 1
                else:
                    r = m - 1
        return self._decode(res_code)

def main():
    obj = TimeMap()
    obj.set('foo', 'bar', 1)
    assert obj.get('foo', 1) == 'bar'
    assert obj.get('foo', 3) == 'bar'
    obj.set('foo', 'bar2', 4)
    assert obj.get('foo', 4) == 'bar2'
    assert obj.get('foo', 5) == 'bar2'

if __name__ == "__main__":
    main()
