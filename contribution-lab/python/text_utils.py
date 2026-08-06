"""Beginner-friendly text utility functions."""


def normalize_whitespace(text: str) -> str:
    """Remove surrounding whitespace and collapse repeated whitespace."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")

    return " ".join(text.split())


def count_words(text: str) -> int:
    """Return the number of words in the given text."""
    normalized = normalize_whitespace(text)

    if not normalized:
        return 0

    return len(normalized.split(" "))


def is_palindrome(text: str) -> bool:
    """Check if the text is a palindrome, ignoring whitespace and case."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    clean_text = text.replace(" ", "").lower()
    return clean_text == clean_text[::-1]