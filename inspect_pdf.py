"""Inspect PDF and dump all text using PyMuPDF"""
import pymupdf
import sys
import io

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PDF_PATH = r"c:\Users\mdhas\Desktop\Dsa Quetions\DSA_100_LeetCode_Roadmap_CPP_Java.pdf"

doc = pymupdf.open(PDF_PATH)
print(f"Total pages: {len(doc)}\n")

all_text = []
for page_num, page in enumerate(doc):
    text = page.get_text("text")
    all_text.append(f"===== PAGE {page_num+1} =====\n{text}\n")
    print(f"===== PAGE {page_num+1} =====")
    print(text)
    print()

doc.close()

# Save to file
with open(r"c:\Users\mdhas\Desktop\Dsa Quetions\pdf_content.txt", "w", encoding="utf-8") as f:
    f.writelines(all_text)

print("\nSaved to pdf_content.txt")
