from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from notes import router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"image_url": file_path}


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def home():
    return {"message": "API running 🚀"}