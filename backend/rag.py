from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import re

# ---------- Clean helper ----------
def clean_text(text):
    text = text.replace("\n", " ")
    # split joined words like "machineLearning"
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    # normalize spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# 1. Load PDF
loader = PyPDFLoader("sample.pdf")
documents = loader.load()

# 2. Split text (smaller chunks = better retrieval)
splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=30
)
chunks = splitter.split_documents(documents)

# 3. Embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 4. Vector DB
vectorstore = FAISS.from_documents(chunks, embeddings)

# 5. Retriever (get a few candidates)
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# 6. Model
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")


# 7. Function
def ask_question(query):
    docs = retriever.invoke(query)

    if not docs:
        return "Not found in document."

    # keep stronger chunks only, then top 2
    docs = [d for d in docs if len(d.page_content) > 100][:2]

    # clean context (key fix)
    raw_context = " ".join([d.page_content for d in docs])
    context = clean_text(raw_context)

    prompt = f"""
You are a helpful AI assistant.

Answer the question in ONE complete and informative sentence.
Do not give short phrases. Use ONLY the context.

If the answer is not present, say "Not found in document".

Context:
{context}

Question: {query}

Answer:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        do_sample=False
    )

    answer = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    # ensure full sentence
    if not answer.endswith("."):
        answer += "."

    # fallback for weak outputs
    if len(answer.split()) < 4:
        return "Not found in document."

    return answer