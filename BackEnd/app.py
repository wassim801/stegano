from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from stegano import lsb
from PIL import Image
import os
import uuid
import mimetypes
import logging

# Set up logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = "static/"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
logging.basicConfig(level=logging.DEBUG)

# Helper function to generate unique file names
def generate_unique_filename(filename):
    unique_id = str(uuid.uuid4())
    file_ext = os.path.splitext(filename)[1]
    return f"{unique_id}{file_ext}"

# Route: Embed text into image
@app.route("/embed", methods=["POST"])
def embed_text():
    if "image" not in request.files or "message" not in request.form:
        return jsonify({"error": "Image and message are required"}), 400

    image = request.files["image"]
    message = request.form["message"]

    try:
        # Save the uploaded image with a unique name
        unique_filename = generate_unique_filename(image.filename)
        image_path = os.path.abspath(os.path.join(app.config["UPLOAD_FOLDER"], unique_filename))
        image.save(image_path)

        # Embed the message into the image
        secret_image_filename = f"secret_{unique_filename}"
        secret_image_path = os.path.abspath(os.path.join(app.config["UPLOAD_FOLDER"], secret_image_filename))

        secret_image = lsb.hide(image_path, message)
        secret_image.save(secret_image_path)

        # Ensure the secret image was created
        if not os.path.exists(secret_image_path):
            raise FileNotFoundError(f"Failed to create secret image at {secret_image_path}")

        # Dynamically determine MIME type and return the file
        mimetype, _ = mimetypes.guess_type(secret_image_path)
        return send_file(secret_image_path, mimetype=mimetype)

    except Exception as e:
        return jsonify({"error": f"An error occurred while embedding text: {str(e)}"}), 500

# Route: Extract text from image
@app.route("/extract", methods=["POST"])
def extract_text():
    if "image" not in request.files:
        return jsonify({"error": "Image is required"}), 400

    image = request.files["image"]

    try:
        # Save the uploaded image with a unique name
        unique_filename = generate_unique_filename(image.filename)
        image_path = os.path.abspath(os.path.join(app.config["UPLOAD_FOLDER"], unique_filename))
        image.save(image_path)

        # Extract the hidden message
        hidden_message = lsb.reveal(image_path)
        if hidden_message:
            return jsonify({"message": hidden_message}), 200
        else:
            return jsonify({"message": "No hidden data found"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred while extracting text: {str(e)}"}), 500

# Route: Analyze image for hidden data
@app.route("/analyze", methods=["POST"])
def analyze_image():
    if "image" not in request.files:
        return jsonify({"error": "Image is required"}), 400

    image = request.files["image"]

    try:
        # Save the uploaded image with a unique name
        unique_filename = generate_unique_filename(image.filename)
        image_path = os.path.abspath(os.path.join(app.config["UPLOAD_FOLDER"], unique_filename))
        image.save(image_path)

        # Check for hidden data
        hidden_message = lsb.reveal(image_path)
        if hidden_message:
            return jsonify({"message": "Hidden data detected!"}), 200
        else:
            return jsonify({"message": "No hidden data found."}), 200

    except Exception as e:
        # Log the error message for better debugging
        app.logger.error(f"Error analyzing image: {str(e)}")
        return jsonify({"error": f"An error occurred while analyzing the image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
