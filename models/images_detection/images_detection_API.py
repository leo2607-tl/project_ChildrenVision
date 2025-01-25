import warnings
warnings.filterwarnings("ignore")
import torch
from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
from ultralytics import YOLO

app = Flask(__name__)

model = YOLO('/home/leo/workspace/Personal_Project/Children_Vision/models/images_detection/last.pt')

def decode_base64_to_image(base64_string):
    try:
        decoded_bytes = base64.b64decode(base64_string)
        np_image = np.frombuffer(decoded_bytes, np.uint8)
        img = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Cannot decode image from Base64 string.")
        return img
    except Exception as e:
        raise ValueError(f"Error decoding Base64 image: {str(e)}")

def predict_and_annotate(image):
    try:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = model(image_rgb)

        annotated_image = image.copy()
        predictions = []

        for result in results:
            for box in result.boxes:
                x_min, y_min, x_max, y_max = map(int, box.xyxy[0]) 
                conf = float(box.conf[0])  
                class_id = int(box.cls[0])  
                class_name = model.names[class_id] 

                predictions.append({
                    "class": class_name,
                    "confidence": conf,
                    "bbox": [x_min, y_min, x_max, y_max]
                })

                cv2.rectangle(annotated_image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
                cv2.putText(annotated_image, f"{class_name} {conf:.2f}", (x_min, y_min - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', annotated_image)
        annotated_base64 = base64.b64encode(buffer).decode('utf-8')

        return annotated_base64, predictions

    except Exception as e:
        raise ValueError(f"Error during prediction and annotation: {str(e)}")


@app.route('/predict', methods=['POST'])
def process_image():
    try:
        print("Step 1: Received request at /predict endpoint.")
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'Missing "image" field in request'}), 400

        input_base64 = data['image']
        print("Step 2: Decoding Base64 image...")
        decoded_image = base64.b64decode(input_base64)
        np_image = np.frombuffer(decoded_image, np.uint8)
        img = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Không thể giải mã ảnh từ chuỗi Base64.")

        print("Step 3: Running prediction and annotation...")
        annotated_image, predictions = predict_and_annotate(img)

        print(f"Step 4: Prediction complete. Found {len(predictions)} objects.")
        return jsonify({'annotated_image': annotated_image, 'predictions': predictions}), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='192.168.32.55', port=5002)
