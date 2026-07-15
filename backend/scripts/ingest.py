"""Ingest documents from backend/data into the document_chunks table.

Usage (from the backend/ directory, with the venv activated):
    python scripts/ingest.py
"""

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from pypdf import PdfReader  # noqa: E402

from core.database import SessionLocal  # noqa: E402
from services.rag import ingest_document  # noqa: E402


DATA_DIR = BACKEND_DIR / 'data'


def read_text(path: Path) -> str:
    if path.suffix.lower() == '.pdf':
        reader = PdfReader(str(path))
        return '\n\n'.join(page.extract_text() or '' for page in reader.pages)
    return path.read_text(encoding='utf-8')


def main() -> None:
    paths = sorted(p for p in DATA_DIR.glob('*') if p.suffix.lower() in {'.md', '.txt', '.pdf'})
    if not paths:
        print(f'No documents found in {DATA_DIR}')
        return

    db = SessionLocal()
    try:
        for path in paths:
            text = read_text(path)
            count = ingest_document(db, source=path.name, text=text)
            print(f'{path.name}: ingested {count} chunks')
    finally:
        db.close()


if __name__ == '__main__':
    main()
