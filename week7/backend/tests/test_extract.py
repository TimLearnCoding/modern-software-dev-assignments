from backend.app.services.extract import extract_action_items


def test_extract_original_patterns():
    text = """
    This is a note
    - TODO: write tests
    - ACTION: review PR
    - Ship it!
    Not actionable
    """.strip()
    items = extract_action_items(text)
    assert "TODO: write tests" in items
    assert "ACTION: review PR" in items
    assert "Ship it!" in items
    assert len(items) == 3


def test_extract_fixme_and_hack():
    text = """
    - FIXME: broken query on edge case
    - HACK: temporary workaround for auth
    - Normal line
    """.strip()
    items = extract_action_items(text)
    assert "FIXME: broken query on edge case" in items
    assert "HACK: temporary workaround for auth" in items
    assert len(items) == 2


def test_extract_deadlines():
    text = """
    - Submit report by Friday
    - due 2024-01-15 finalize budget
    - Refactor by tomorrow
    - Just a regular note
    """.strip()
    items = extract_action_items(text)
    assert "Submit report by Friday" in items
    assert "due 2024-01-15 finalize budget" in items
    assert "Refactor by tomorrow" in items
    assert len(items) == 3


def test_extract_mentions():
    text = """
    - @alice please review this
    - @bob fix the login bug
    - No mention here
    """.strip()
    items = extract_action_items(text)
    assert "@alice please review this" in items
    assert "@bob fix the login bug" in items
    assert len(items) == 2


def test_extract_priority_tags():
    text = """
    - [HIGH] migrate database
    - [P0] fix production outage
    - [LOW] update README
    - No priority here
    """.strip()
    items = extract_action_items(text)
    assert "[HIGH] migrate database" in items
    assert "[P0] fix production outage" in items
    assert "[LOW] update README" in items
    assert len(items) == 3


def test_extract_non_actionable_returns_empty():
    text = """
    Just a regular note
    Nothing to do here
    All good
    """.strip()
    items = extract_action_items(text)
    assert items == []


