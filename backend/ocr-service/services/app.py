from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

from fastapi.middleware.cors import CORSMiddleware

from services.ocr_engine import extract_text
from services.parser import parse_invoice

import tempfile
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "data/invoices.json"


def load_db():

    if not os.path.exists(DB_FILE):
        return []

    with open(DB_FILE, "r") as f:
        return json.load(f)


def save_db(data):

    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)


@app.get("/")
def health():

    return {
        "status": "running"
    }


@app.post("/api/ocr/process")
async def process_invoice(
    file: UploadFile = File(...)
):

    with tempfile.NamedTemporaryFile(
        suffix=".pdf",
        delete=False
    ) as temp_pdf:

        temp_pdf.write(
            await file.read()
        )

        pdf_path = temp_pdf.name

    try:

        raw_text = extract_text(
            pdf_path
        )

        fields = parse_invoice(
            raw_text
        )

        invoices = load_db()

        invoice_id = len(invoices) + 1

        invoice = {
            "id": invoice_id,
            "customer": "",
            "invoice_number":
                fields["invoice_number"],
            "total_amount":
                fields["total_amount"],
            "status": "draft",
            "raw_text": raw_text
        }

        invoices.append(invoice)

        save_db(invoices)

        return invoice

    finally:

        os.remove(pdf_path)


@app.get("/api/invoices")
def get_invoices():

    return load_db()


@app.get("/api/invoices/{invoice_id}")
def get_invoice(invoice_id: int):

    invoices = load_db()

    for invoice in invoices:

        if invoice["id"] == invoice_id:
            return invoice

    raise HTTPException(
        404,
        "Invoice not found"
    )


@app.patch("/api/invoices/{invoice_id}")
async def update_invoice(
    invoice_id: int,
    payload: dict
):

    invoices = load_db()

    for invoice in invoices:

        if invoice["id"] == invoice_id:

            invoice.update(payload)

            save_db(invoices)

            return invoice

    raise HTTPException(
        404,
        "Invoice not found"
    )