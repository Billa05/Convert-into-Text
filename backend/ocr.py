from flask import Flask, request
from flask_cors import CORS
from PIL import Image
import numpy as np
import cv2
import pytesseract

app = Flask(__name__)
CORS(app)  

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    lang = request.form.get('lang')

    img = Image.open(file.stream)

    img = np.array(img)

    text = extract_text_from_image(img,lang)
    print(text)

    return text

def extract_text_from_image(img,lang):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    text = pytesseract.image_to_string(gray,lang=lang)
    return text

if __name__ == '__main__':
    app.run(debug=True)