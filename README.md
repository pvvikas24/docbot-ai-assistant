# 🤖 DocBot – AI Document Assistant

DocBot is an AI-powered application built using **Retrieval-Augmented Generation (RAG)** and **FastAPI** to answer questions based on a document.

---

## 🧠 Core Concept

This project focuses on implementing a **RAG pipeline** with a **FastAPI backend** to build a real-world AI system.

### 🔹 What is RAG?
Retrieval-Augmented Generation (RAG) combines:
- Retrieval → Finds relevant document chunks  
- Generation → Generates answers using a model  

---

## ⚙️ How it Works

1. Load PDF and split into chunks  
2. Convert chunks into embeddings  
3. Store in FAISS  
4. User sends query → FastAPI  
5. Retrieve relevant chunks  
6. Generate answer using FLAN-T5  

---
## 🚀 Features

- Ask questions from a PDF
- ChatGPT-like UI
- FastAPI backend
- FAISS vector database
- Local embeddings (MiniLM)
- Local LLM (FLAN-T5)
- Works offline (no paid APIs)

---

## 🧠 How it works

1. Load PDF and split into chunks  
2. Convert chunks into embeddings  
3. Store embeddings in FAISS  
4. User asks a question  
5. Relevant chunks are retrieved  
6. FLAN-T5 generates answer  

---

## 🛠 Tech Stack

- Python (FastAPI)
- React JS
- LangChain
- FAISS
- HuggingFace Transformers

---
## 📸 Demo

![DocBot UI](frontend/public/demo.png)

## ▶️ Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Endpoint:

POST `/ask`

Example request:

```json
{
  "question": "What is AI?"
}







