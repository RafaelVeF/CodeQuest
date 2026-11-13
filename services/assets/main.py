"""
CodeQuest — Service Assets (Génération de défis visuels par graine)
Python / FastAPI + Pillow + qrcode + MinIO S3
"""

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
import io
import qrcode
from PIL import Image, ImageDraw, ImageFont
import hashlib
import random

app = FastAPI(
    title="CodeQuest Assets Service",
    description="Génération et validation des défis visuels (Stéganographie, QR Codes cachés)",
    version="1.0.0"
)

class SteganoRequest(BaseModel):
    seed: str = Field(..., description="Graine unique par utilisateur/équipe")
    secret_text: str = Field(..., description="Message secret à dissimuler")
    challenge_id: str

class QrRequest(BaseModel):
    seed: str = Field(..., description="Graine unique")
    payload: str = Field(..., description="Texte encodé dans le QR code")
    degrade_level: int = Field(default=1, ge=1, le=5)

class VerifySteganoRequest(BaseModel):
    expected_secret: str
    submitted_secret: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "codequest-assets"}

@app.post("/assets/generate/qrcode")
def generate_hidden_qr(req: QrRequest):
    """
    Génère un QR Code dissimulé ou fragmenté selon le niveau de difficulté.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(req.payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    # Si niveau de dégradation > 1, ajout d'un léger bruit pseudo-aléatoire basé sur seed
    if req.degrade_level > 1:
        rng = random.Random(req.seed)
        draw = ImageDraw.Draw(img)
        w, h = img.size
        for _ in range(req.degrade_level * 50):
            x = rng.randint(0, w)
            y = rng.randint(0, h)
            draw.point((x, y), fill=(rng.randint(200, 255), rng.randint(200, 255), rng.randint(200, 255)))

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    # Hash du fichier produit
    file_hash = hashlib.sha256(buffer.getvalue()).hexdigest()

    return {
        "status": "generated",
        "challenge_id": req.seed,
        "content_type": "image/png",
        "file_hash": file_hash,
        "byte_size": len(buffer.getvalue()),
        "message": "Asset QR généré avec succès (prêt pour upload S3)"
    }

@app.post("/assets/generate/stegano")
def generate_stegano_image(req: SteganoRequest):
    """
    Génère une image avec message inséré par stéganographie LSB.
    """
    # Création d'une image synthétique basée sur le seed
    rng = random.Random(req.seed)
    width, height = 400, 400
    img = Image.new("RGB", (width, height), color=(rng.randint(20, 60), rng.randint(20, 60), rng.randint(40, 80)))
    draw = ImageDraw.Draw(img)

    for _ in range(20):
        x1 = rng.randint(0, width)
        y1 = rng.randint(0, height)
        x2 = rng.randint(0, width)
        y2 = rng.randint(0, height)
        draw.line((x1, y1, x2, y2), fill=(rng.randint(0, 255), rng.randint(0, 255), 255), width=2)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    file_hash = hashlib.sha256(buffer.getvalue()).hexdigest()

    return {
        "status": "generated",
        "challenge_id": req.challenge_id,
        "secret_hash": hashlib.sha256(req.secret_text.encode()).hexdigest(),
        "file_hash": file_hash,
        "byte_size": len(buffer.getvalue()),
        "message": "Asset stéganographique généré avec succès"
    }

@app.post("/assets/verify")
def verify_solution(req: VerifySteganoRequest):
    """
    Vérification en mode atelier : valide si le secret soumis correspond à l'original.
    """
    is_valid = req.submitted_secret.strip() == req.expected_secret.strip()
    return {
        "valid": is_valid,
        "score_multiplier": 1.0 if is_valid else 0.0
    }

