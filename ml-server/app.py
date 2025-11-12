import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io

# Initialize Flask app
app = Flask(__name__)
# Enable CORS to allow your React app (from a different port) to call this server
CORS(app)

# Load the trained model
try:
    model = tf.keras.models.load_model('inception_pet.keras')
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Load the class names
try:
    with open('class_names.json', 'r') as f:
        class_names = json.load(f)
    print(f"✅ Loaded {len(class_names)} class names.")
except Exception as e:
    print(f"❌ Error loading class_names.json: {e}")
    class_names = []

# Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict_breed():
    if model is None or not class_names:
        return jsonify({'error': 'Model or class names not loaded'}), 500

    # 1. Check if a file was sent
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # 2. Load and preprocess the image (based on your notebook)
        # Read the file stream into PIL
        img = Image.open(file.stream).convert('RGB')
        
        # InceptionV3 expects 299x299
        img = img.resize((299, 299)) 
        
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.inception_v3.preprocess_input(img_array)

        # 3. Predict
        preds = model.predict(img_array)

        # 4. Decode the prediction
        predicted_class_index = np.argmax(preds)
        predicted_class = class_names[predicted_class_index].replace('_', ' ') # Make it user-friendly
        confidence = np.max(preds) * 100

        # 5. Return the result as JSON
        return jsonify({
            'breed': predicted_class,
            'confidence': f"{confidence:.2f}"
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

# Run the app
if __name__ == '__main__':
    # Flask default port is 5000
    app.run(debug=True, port=5000)