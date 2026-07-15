import math

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from core.config import get_embedding_model, get_google_api_key
from models.document_chunk import DocumentChunk


CHUNK_SIZE = 800
CHUNK_OVERLAP = 100
TOP_K = 4


def _build_embeddings() -> GoogleGenerativeAIEmbeddings:
    return GoogleGenerativeAIEmbeddings(model=get_embedding_model(), google_api_key=get_google_api_key())


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]

    chunks: list[str] = []
    current = ''
    for paragraph in paragraphs:
        candidate = f'{current}\n\n{paragraph}' if current else paragraph
        if len(candidate) <= chunk_size:
            current = candidate
            continue

        if current:
            chunks.append(current)

        if len(paragraph) <= chunk_size:
            tail = current[-overlap:] if current else ''
            current = f'{tail}\n\n{paragraph}' if tail else paragraph
            if len(current) > chunk_size:
                chunks.append(current)
                current = ''
        else:
            start = 0
            while start < len(paragraph):
                end = start + chunk_size
                chunks.append(paragraph[start:end])
                start = end - overlap
            current = ''
    if current:
        chunks.append(current)
    return chunks


def ingest_document(db: Session, source: str, text: str) -> int:
    chunks = chunk_text(text)
    if not chunks:
        return 0

    embeddings = _build_embeddings().embed_documents(chunks)

    db.execute(delete(DocumentChunk).where(DocumentChunk.source == source))
    for index, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        db.add(DocumentChunk(source=source, chunk_index=index, content=chunk, embedding=embedding))
    db.commit()
    return len(chunks)


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def retrieve_relevant_chunks(db: Session, query: str, k: int = TOP_K) -> list[str]:
    rows = db.scalars(select(DocumentChunk)).all()
    if not rows:
        return []

    query_embedding = _build_embeddings().embed_query(query)
    scored = sorted(
        ((_cosine_similarity(query_embedding, row.embedding), row.content) for row in rows),
        key=lambda item: item[0],
        reverse=True,
    )
    return [content for _, content in scored[:k]]
