import re


def parse_invoice(text: str):

    invoice_number = ""

    amount = ""

    invoice_match = re.search(
        r"INV[- ]?\d+",
        text,
        re.IGNORECASE
    )

    if invoice_match:
        invoice_number = invoice_match.group()

    amount_match = re.search(
        r"(?:₹|Rs\.?)\s*([\d,]+(?:\.\d+)?)",
        text
    )

    if amount_match:
        amount = amount_match.group(1)

    return {
        "invoice_number": invoice_number,
        "total_amount": amount
    }