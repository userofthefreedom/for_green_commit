import unittest

from text_utils import count_words, normalize_whitespace


class TextUtilsTest(unittest.TestCase):
    def test_normalize_whitespace(self) -> None:
        result = normalize_whitespace(
            "  first   open source   contribution  "
        )

        self.assertEqual(
            result,
            "first open source contribution",
        )

    def test_empty_text(self) -> None:
        self.assertEqual(normalize_whitespace(""), "")
        self.assertEqual(count_words("   "), 0)

    def test_count_words(self) -> None:
        self.assertEqual(
            count_words("first open source contribution"),
            4,
        )

    def test_invalid_type(self) -> None:
        with self.assertRaises(TypeError):
            normalize_whitespace(None)  # type: ignore[arg-type]

    def test_truncate(self) -> None:
        from text_utils import truncate
        self.assertEqual(truncate("open source contribution", 10), "open sourc...")
        self.assertEqual(truncate("hi", 10), "hi")
        with self.assertRaises(TypeError):
            truncate(None, 10)  # type: ignore[arg-type]


if __name__ == "__main__":
    unittest.main()