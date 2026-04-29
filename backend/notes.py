from fastapi import APIRouter, HTTPException
from models import Note
from database import notes_collection
from redis_client import redis_client
from bson import ObjectId
import json

router = APIRouter()




@router.get("/notes")
async def get_notes():

    cached = redis_client.get("notes")

    if cached:
        print("⚡ From Redis Cache")
        return json.loads(cached)


    notes = []
    async for note in notes_collection.find():
        note["_id"] = str(note["_id"])
        notes.append(note)


    redis_client.set("notes", json.dumps(notes), ex=60)

    print("📦 From MongoDB")

    return notes





@router.post("/notes")
async def create_note(note: Note):
    result = await notes_collection.insert_one(note.dict())


    redis_client.delete("notes")

    return {"id": str(result.inserted_id)}





@router.put("/notes/{id}")
async def update_note(id: str, note: Note):
    result = await notes_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": note.dict()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")


    redis_client.delete("notes")

    return {"message": "Note updated"}





@router.delete("/notes/{id}")
async def delete_note(id: str):
    result = await notes_collection.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")


    redis_client.delete("notes")

    return {"message": "Note deleted"}