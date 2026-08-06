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

    def test_capitalize_first_letter(self) -> None:
        from text_utils import capitalize_first_letter
        self.assertEqual(capitalize_first_letter("open source"), "Open source")
        self.assertEqual(capitalize_first_letter(""), "")
        with self.assertRaises(TypeError):
            capitalize_first_letter(None)  # type: ignore[arg-type]


if __name__ == "__main__":
    unittest.main()