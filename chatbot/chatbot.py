import google.generativeai as genai
import os
import logging
from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)

# **Set Google AI Gemini API Key**
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logging.error("❌ GEMINI_API_KEY is missing in .env file")
    raise ValueError("Missing GEMINI_API_KEY in .env file")

genai.configure(api_key=api_key)

# **MongoDB Atlas Connection**
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    logging.error("❌ MONGO_URI is missing in .env file")
    raise ValueError("Missing MONGO_URI in .env file")

try:
    client = MongoClient(mongo_uri)
    db = client["hospitalDB"]
    hospital_collection = db["hospitals"]
    logging.info("✅ Connected to MongoDB Atlas successfully.")
except Exception as e:
    logging.error(f"❌ Failed to connect to MongoDB Atlas: {str(e)}")
    raise

def get_nearby_hospitals(user_location):
    """Find nearby hospitals with available beds using MongoDB Geospatial Query"""
    if not user_location or "latitude" not in user_location or "longitude" not in user_location:
        return []

    try:
        # Convert user location to MongoDB geoJSON format
        user_coords = {
            "type": "Point",
            "coordinates": [user_location["longitude"], user_location["latitude"]]
        }

        # Find hospitals within 10km radius that have available beds
        hospitals = hospital_collection.find({
            "location": {
                "$near": {
                    "$geometry": user_coords,
                    "$maxDistance": 10000  # 10km radius
                }
            },
            "available_beds": {"$gt": 0}
        }).sort("distance_km", 1).limit(5)  # Sort by nearest

        return [{"name": h["name"], "beds": h["available_beds"], "distance": round(h["distance_km"], 2)} for h in hospitals]

    except Exception as e:
        logging.error(f"❌ Error fetching nearby hospitals: {str(e)}")
        return []

@app.route("/chatbot/query", methods=["POST"])
def chatbot_response():
    try:
        data = request.json
        user_role = data.get("role")
        user_input = data.get("message")
        location = data.get("location")  # Expecting { "latitude": 12.9716, "longitude": 77.5946 }

        if not user_role or not user_input:
            return jsonify({"error": "❌ Missing required fields: 'role' and 'message'"}), 400

        logging.info(f"📩 Received request - Role: {user_role}, Message: {user_input}, Location: {location}")

        # **Handle Nearby Hospital Search**
        if user_role == "patient" and "nearby hospital" in user_input.lower():
            if not location:
                return jsonify({"response": "📍 Please share your location for nearby hospital recommendations."})
            
            hospitals = get_nearby_hospitals(location)
            if hospitals:
                response_text = "🏥 **Nearby Hospitals:**\n\n"
                response_text += "\n".join([f"- {h['name']} → {h['beds']} beds available ({h['distance']} km away)" for h in hospitals])
            else:
                response_text = "🚑 No nearby hospitals with available beds found."
            return jsonify({"response": response_text})

        # **Check Available Gemini Models**
        try:
            available_models = [model.name for model in genai.list_models()]
            logging.info(f"🧠 Available Gemini Models: {available_models}")
        except Exception as e:
            logging.error("❌ Failed to fetch available Gemini models. Check API key.")
            return jsonify({"error": "❌ Failed to retrieve Gemini models. Check API key and permissions."}), 500

        # **Select Preferred Model**
        preferred_models = ["gemini-1.5-pro-latest", "gemini-1.5-flash-latest", "gemini-1.0-pro"]
        model_name = next((m for m in preferred_models if m in available_models), None)

        if not model_name:
            logging.error("❌ No valid Gemini model found in your account.")
            return jsonify({"error": "❌ No valid Gemini model found. Please check your Google AI account."}), 500

        # **Use Selected Model**
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(f"AI Assistant:\n{user_input}")

        logging.info(f"🤖 Generated Response: {response.text}")

        return jsonify({"response": response.text})

    except Exception as e:
        logging.error(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)