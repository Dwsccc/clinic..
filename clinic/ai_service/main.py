import os
import json
import torch
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForSequenceClassification, AutoTokenizer

app = FastAPI()

# 1. Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Xử lý đường dẫn tuyệt đối (Fix lỗi Windows Path)
BASE_DIR = Path(__file__).parent.resolve()
MODEL_PATH = str(BASE_DIR / "medical_model").replace("\\", "/")

print(f"--- 🚀 Đang thử tải mô hình từ: {MODEL_PATH} ---")

# Khởi tạo biến toàn cục
tokenizer = None
model = None
specialty_map = {}

# --- BẮT ĐẦU KHỐI TRY ---
try:
    # Kiểm tra file config trước khi load
    if not (Path(MODEL_PATH) / "config.json").exists():
        raise FileNotFoundError(f"Không thấy config.json tại {MODEL_PATH}")

    # Tải mô hình
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH, local_files_only=True)

    # Tải map chuyên khoa
    with open(os.path.join(MODEL_PATH, "specialty_map.json"), "r", encoding="utf-8") as f:
        specialty_map = json.load(f)
        
    print("--- ✅ HỆ THỐNG AI ĐÃ KHỞI CHẠY THÀNH CÔNG ---")

except Exception as e: # KHÔNG ĐƯỢC THIẾU DÒNG NÀY
    print(f"--- ❌ LỖI TẢI MÔ HÌNH: {str(e)} ---")
# --- KẾT THÚC KHỐI TRY ---

class SymptomInput(BaseModel):
    text: str

@app.post("/predict")
async def predict(data: SymptomInput):
    if tokenizer is None or model is None:
        return {"error": "Mô hình AI chưa được tải thành công."}

    try:
        inputs = tokenizer(data.text, return_tensors="pt", padding=True, truncation=True, max_length=256)
        with torch.no_grad():
            outputs = model(**inputs)
        
        prediction = torch.argmax(outputs.logits, dim=-1).item()
        specialty = specialty_map.get(str(prediction), "Khoa Đa Khoa (Hô hấp/Chung)")
        
        return {
            "specialty": specialty,
            "advice": f"Dựa trên triệu chứng, bạn có thể đang gặp vấn đề liên quan đến {specialty}. Bạn nên đăng ký khám chuyên khoa này để được bác sĩ tư vấn kỹ hơn."
        }
    except Exception as e:
        return {"error": str(e)}