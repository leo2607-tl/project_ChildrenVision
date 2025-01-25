import logging
from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

def contour_drawing_from_base64(input_base64, params):
    try:
        decoded_image = base64.b64decode(input_base64)
        np_image = np.frombuffer(decoded_image, np.uint8)
        image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Không thể giải mã ảnh từ chuỗi Base64.")
        
        kernel_size = int(params['kernelSize'])
        sigma_s = float(params['sigmaS'])
        sigma_r = float(params['sigmaR'])
        block_size = int(params['blockSize'])
        c_value = float(params['C'])
        canny_thresh1 = int(params['lowThreshold'])
        canny_thresh2 = int(params['highThreshold'])
        dilate_iter = int(params['dilationIterations'])
        erode_iter = int(params['erosionIterations'])

        logging.debug(f"Giá trị tham số: kernel_size={kernel_size}, sigma_s={sigma_s}, sigma_r={sigma_r}, "
                      f"block_size={block_size}, c_value={c_value}, canny_thresh1={canny_thresh1}, "
                      f"canny_thresh2={canny_thresh2}, dilate_iter={dilate_iter}, erode_iter={erode_iter}")

        if kernel_size <= 0 or kernel_size % 2 == 0:
            raise ValueError("kernelSize phải là số lẻ và lớn hơn 0.")
        if block_size <= 1 or block_size % 2 == 0:
            raise ValueError("blockSize phải là số lẻ và lớn hơn 1.")
        if dilate_iter < 0 or erode_iter < 0:
            raise ValueError("dilateIter và erodeIter phải lớn hơn hoặc bằng 0.")

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        blurred = cv2.bilateralFilter(gray, kernel_size, sigma_s, sigma_r)

        # Apply adaptive threshold
        adaptive_thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, block_size, c_value
        )

        # Apply Canny edge detection
        edges = cv2.Canny(adaptive_thresh, canny_thresh1, canny_thresh2)

        kernel = np.ones((3, 3), np.uint8)
        edges = cv2.dilate(edges, kernel, iterations=dilate_iter)
        edges = cv2.erode(edges, kernel, iterations=erode_iter)

        contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
        contour_image = np.ones_like(image) * 255
        cv2.drawContours(contour_image, contours, -1, (0, 0, 0), 1)

        _, buffer = cv2.imencode('.jpg', contour_image)
        output_base64 = base64.b64encode(buffer).decode('utf-8')

        return output_base64

    except Exception as e:
        logging.error(f"Error in processing image: {str(e)}")
        raise ValueError(f"Error in processing image: {str(e)}")

@app.route('/process', methods=['POST'])
def process_image():
    try:
        data = request.json
        if 'image' not in data or 'params' not in data:
            return jsonify({'error': 'Thiếu "image" hoặc "params" trong yêu cầu.'}), 400

        input_base64 = data['image']
        params = data['params']

        output_base64 = contour_drawing_from_base64(input_base64, params)

        return jsonify({'output_image': output_base64})
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='192.168.32.55', port=5000)
