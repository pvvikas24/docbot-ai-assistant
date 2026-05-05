from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import ask_question   # 👈 ADD THIS

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all (for dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.post("/ask")
def ask(q: Query):
    answer = ask_question(q.question)   # 👈 CHANGE HERE
    return {"answer": answer}