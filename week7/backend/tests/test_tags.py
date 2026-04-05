def test_create_and_list_tags(client):
    r = client.post("/tags/", json={"name": "urgent"})
    assert r.status_code == 201
    tag = r.json()
    assert tag["name"] == "urgent"

    r = client.post("/tags/", json={"name": "bug"})
    assert r.status_code == 201

    r = client.get("/tags/")
    assert r.status_code == 200
    tags = r.json()
    assert len(tags) == 2


def test_create_duplicate_tag_rejected(client):
    client.post("/tags/", json={"name": "duplicate"})
    r = client.post("/tags/", json={"name": "duplicate"})
    assert r.status_code == 409


def test_delete_tag(client):
    r = client.post("/tags/", json={"name": "to-delete"})
    tag_id = r.json()["id"]

    r = client.delete(f"/tags/{tag_id}")
    assert r.status_code == 204

    r = client.get("/tags/")
    assert all(t["name"] != "to-delete" for t in r.json())


def test_add_tag_to_note(client):
    r = client.post("/notes/", json={"title": "Tagged note", "content": "Hello"})
    note_id = r.json()["id"]

    r = client.post("/tags/", json={"name": "feature"})
    tag_id = r.json()["id"]

    r = client.post(f"/tags/notes/{note_id}/tags/{tag_id}")
    assert r.status_code == 200
    note = r.json()
    assert len(note["tags"]) == 1
    assert note["tags"][0]["name"] == "feature"


def test_remove_tag_from_note(client):
    r = client.post("/notes/", json={"title": "Note", "content": "Content"})
    note_id = r.json()["id"]

    r = client.post("/tags/", json={"name": "temp"})
    tag_id = r.json()["id"]

    client.post(f"/tags/notes/{note_id}/tags/{tag_id}")

    r = client.delete(f"/tags/notes/{note_id}/tags/{tag_id}")
    assert r.status_code == 200
    note = r.json()
    assert len(note["tags"]) == 0


def test_note_read_includes_tags(client):
    r = client.post("/notes/", json={"title": "With tags", "content": "Body"})
    note_id = r.json()["id"]

    r = client.post("/tags/", json={"name": "alpha"})
    tag1_id = r.json()["id"]
    r = client.post("/tags/", json={"name": "beta"})
    tag2_id = r.json()["id"]

    client.post(f"/tags/notes/{note_id}/tags/{tag1_id}")
    client.post(f"/tags/notes/{note_id}/tags/{tag2_id}")

    r = client.get(f"/notes/{note_id}")
    assert r.status_code == 200
    note = r.json()
    tag_names = [t["name"] for t in note["tags"]]
    assert "alpha" in tag_names
    assert "beta" in tag_names
