import warnings
warnings.filterwarnings("ignore")
import tensorflow as tf
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import json
tf.config.set_visible_devices([], 'GPU')
app = Flask(__name__)

model_path = '/home/leo/workspace/Personal_Project/Children_Vision/models/images_classification/best_model.keras'
class_indices_path = '/home/leo/workspace/Personal_Project/Children_Vision/models/images_classification/class_indices.json'

model = load_model(model_path)

with open(class_indices_path, 'r') as f:
    class_indices = json.load(f)
class_labels = {v: k for k, v in class_indices.items()}
class_labels = [class_labels[i] for i in range(len(class_labels))]

def predict_image_from_base64(input_base64):
    try:
        decoded_image = base64.b64decode(input_base64)
        np_image = np.frombuffer(decoded_image, np.uint8)
        img = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        if img is None:
            raise ValueError("Không thể giải mã ảnh từ chuỗi Base64.")

        img_resized = cv2.resize(img, (128, 128)) 
        img_resized = img_resized / 255.0  
        img_array = np.expand_dims(img_resized, axis=0) 
        cv2.imwrite('debug_decoded_image.jpg', img)
        print(f"Shape of img_resized: {img_resized.shape}")
        print(f"Max pixel value: {np.max(img_resized)}")
        print(f"Min pixel value: {np.min(img_resized)}")

        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions) 
        predicted_label = class_labels[predicted_class] 
        print(f"Nhãn dự đoán: {predicted_label}")
        return predicted_label

    except Exception as e:
        raise ValueError(f"Error in processing image: {str(e)}")

@app.route('/predict', methods=['POST'])
def process_image():
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'Missing "image" field in request'}), 400

        input_base64 = data['image']

        predicted_label = predict_image_from_base64(input_base64)

        return jsonify({'predicted_label': predicted_label})  

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='192.168.32.55', port=5001)
