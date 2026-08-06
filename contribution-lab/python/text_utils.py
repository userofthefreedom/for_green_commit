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


def truncate(text: str, max_length: int) -> str:
    """Truncate text to max_length and append ... if needed."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    if len(text) > max_length:
        return text[:max_length] + "..."
    return text