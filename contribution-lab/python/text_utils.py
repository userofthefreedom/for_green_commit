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


def capitalize_first_letter(text: str) -> str:
    """Capitalize the first letter of the text."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    if not text:
        return text
    return text[0].upper() + text[1:]