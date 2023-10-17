from fastapi import FastAPI, File, UploadFile, HTTPException
from .utils.file import allowed_file
from .utils.torch_utils import get_prediction

app = FastAPI()

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get("/")
async def read_root():
    return {"message": "This is biobotanix API."}

@app.post("/predict")
async def predict(file: UploadFile):    
    if file and allowed_file(file.filename):
        img_bytes = await file.read()
        prediction = get_prediction(image_bytes=img_bytes)
        return {"prediction": prediction}
    else:
        raise HTTPException(status_code=400, detail="File not found or invalid file type.")
    