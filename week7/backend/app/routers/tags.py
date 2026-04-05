from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Note, Tag
from ..schemas import NoteRead, TagCreate, TagRead

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("/", response_model=list[TagRead])
def list_tags(db: Session = Depends(get_db)) -> list[TagRead]:
    rows = db.execute(select(Tag).order_by(Tag.name)).scalars().all()
    return [TagRead.model_validate(row) for row in rows]


@router.post("/", response_model=TagRead, status_code=201)
def create_tag(payload: TagCreate, db: Session = Depends(get_db)) -> TagRead:
    existing = db.execute(select(Tag).where(Tag.name == payload.name)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Tag already exists")
    tag = Tag(name=payload.name)
    db.add(tag)
    db.flush()
    db.refresh(tag)
    return TagRead.model_validate(tag)


@router.delete("/{tag_id}", status_code=204)
def delete_tag(tag_id: int, db: Session = Depends(get_db)) -> None:
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    db.delete(tag)
    db.flush()


@router.post("/notes/{note_id}/tags/{tag_id}", response_model=NoteRead)
def add_tag_to_note(
    note_id: int, tag_id: int, db: Session = Depends(get_db)
) -> NoteRead:
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    if tag not in note.tags:
        note.tags.append(tag)
        db.flush()
        db.refresh(note)
    return NoteRead.model_validate(note)


@router.delete("/notes/{note_id}/tags/{tag_id}", response_model=NoteRead)
def remove_tag_from_note(
    note_id: int, tag_id: int, db: Session = Depends(get_db)
) -> NoteRead:
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    if tag in note.tags:
        note.tags.remove(tag)
        db.flush()
        db.refresh(note)
    return NoteRead.model_validate(note)
