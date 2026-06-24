from paddleocr import PaddleOCR
from pdf2image import convert_from_path

import tempfile
import os

ocr = PaddleOCR(
    use_angle_cls=True,
    lang="en"
)


def extract_text(pdf_path: str):

    pages = convert_from_path(pdf_path)

    extracted_lines = []

    for page in pages:

        with tempfile.NamedTemporaryFile(
            suffix=".jpg",
            delete=False
        ) as temp_image:

            page.save(temp_image.name)

            result = ocr.ocr(
                temp_image.name,
                cls=True
            )

            os.remove(temp_image.name)

            if result and result[0]:

                for line in result[0]:

                    text = line[1][0]

                    extracted_lines.append(text)

    return "\n".join(extracted_lines)