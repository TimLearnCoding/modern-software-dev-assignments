"""Tests for pagination (skip/limit) and sorting on notes and action-items."""


# --------------- helpers ---------------

def _seed_notes(client, n=5):
    """Create n notes with titles Note-0 … Note-(n-1)."""
    for i in range(n):
        client.post("/notes/", json={"title": f"Note-{i}", "content": f"body {i}"})


def _seed_items(client, n=5):
    """Create n action items with descriptions Item-0 … Item-(n-1)."""
    for i in range(n):
        client.post("/action-items/", json={"description": f"Item-{i}"})


# =====================  NOTES – pagination  =====================

def test_notes_skip_and_limit(client):
    _seed_notes(client, 5)
    r = client.get("/notes/", params={"skip": 1, "limit": 2})
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_notes_skip_beyond_total_returns_empty(client):
    _seed_notes(client, 3)
    r = client.get("/notes/", params={"skip": 100})
    assert r.status_code == 200
    assert r.json() == []


def test_notes_limit_zero_returns_empty(client):
    _seed_notes(client, 3)
    r = client.get("/notes/", params={"limit": 0})
    assert r.status_code == 200
    assert r.json() == []


def test_notes_limit_exceeds_max_rejected(client):
    r = client.get("/notes/", params={"limit": 201})
    assert r.status_code == 422  # validation error: le=200


def test_notes_default_limit_caps_at_50(client):
    _seed_notes(client, 55)
    r = client.get("/notes/")
    assert len(r.json()) == 50


# =====================  NOTES – sorting  =====================

def test_notes_sort_title_asc(client):
    _seed_notes(client, 5)
    r = client.get("/notes/", params={"sort": "title"})
    titles = [n["title"] for n in r.json()]
    assert titles == sorted(titles)


def test_notes_sort_title_desc(client):
    _seed_notes(client, 5)
    r = client.get("/notes/", params={"sort": "-title"})
    titles = [n["title"] for n in r.json()]
    assert titles == sorted(titles, reverse=True)


def test_notes_invalid_sort_falls_back(client):
    """Invalid sort field should fall back to -created_at (newest first)."""
    _seed_notes(client, 3)
    r = client.get("/notes/", params={"sort": "nonexistent"})
    assert r.status_code == 200
    ids = [n["id"] for n in r.json()]
    assert ids == sorted(ids, reverse=True)


# =====================  ACTION ITEMS – pagination  =====================

def test_items_skip_and_limit(client):
    _seed_items(client, 5)
    r = client.get("/action-items/", params={"skip": 2, "limit": 2})
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_items_skip_beyond_total_returns_empty(client):
    _seed_items(client, 3)
    r = client.get("/action-items/", params={"skip": 100})
    assert r.status_code == 200
    assert r.json() == []


def test_items_limit_exceeds_max_rejected(client):
    r = client.get("/action-items/", params={"limit": 201})
    assert r.status_code == 422


# =====================  ACTION ITEMS – sorting  =====================

def test_items_sort_description_asc(client):
    _seed_items(client, 5)
    r = client.get("/action-items/", params={"sort": "description"})
    descs = [i["description"] for i in r.json()]
    assert descs == sorted(descs)


def test_items_sort_description_desc(client):
    _seed_items(client, 5)
    r = client.get("/action-items/", params={"sort": "-description"})
    descs = [i["description"] for i in r.json()]
    assert descs == sorted(descs, reverse=True)


def test_items_invalid_sort_falls_back(client):
    _seed_items(client, 3)
    r = client.get("/action-items/", params={"sort": "bogus"})
    assert r.status_code == 200
    ids = [i["id"] for i in r.json()]
    assert ids == sorted(ids, reverse=True)
