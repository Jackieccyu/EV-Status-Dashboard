from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time
from datetime import datetime
import random
import logging
import os
from google.cloud import firestore
from google.cloud.exceptions import NotFound

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Realistic constants definition
MIN_BATTERY_THRESHOLD = 20
HIGH_RPM_THRESHOLD = 3000
MAX_TEMPERATURE = 80
MIN_TEMPERATURE = 25
POWER_CONSUMPTION_RATE = {
    0: 0,
    1: 100,    # 100 kW
    2: 300,    # 300 kW
    3: 600,    # 600 kW
    4: 1000    # 1000 kW
}
RPM_SETTINGS = {
    0: 0,
    1: 1500,
    2: 3000,
    3: 4500,
    4: 6000
}
GEAR_RATIOS = {
    0: "N/N",
    1: "4.5:1",
    2: "6.2:1",
    3: "8.1:1",
    4: "10.3:1"
}

# Initialize Firestore
google_credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
if google_credentials_path:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials_path

# Initialize Firestore
db = firestore.Client(project='ev-dashboard-system-2024')

def create_current_state_document():
    doc_ref = db.collection('vehiclestate').document('current_state')
    try:
        doc = doc_ref.get()
        if not doc.exists:
            initial_state = {
                "parking_brake": False,
                "check_engine": False,
                "motor_status": False,
                "battery_low": False,
                "power": 0,
                "motor_rpm": 0,
                "gear_ratio": "N/N",
                "battery_percentage": 100,
                "battery_temperature": 25,
                "motor_speed_setting": 0,
                "is_charging": False,
                "last_update": datetime.now().isoformat()
            }
            doc_ref.set(initial_state)
            logger.info("Created initial current_state document in Firestore")
        else:
            logger.info("current_state document already exists in Firestore")
    except NotFound:
        # If the database doesn't exist, create a new one
        logger.info("Firestore database not found, creating a new one...")
        db.create_database("vehicle-monitoring")
        initial_state = {
            "parking_brake": False,
            "check_engine": False,
            "motor_status": False,
            "battery_low": False,
            "power": 0,
            "motor_rpm": 0,
            "gear_ratio": "N/N",
            "battery_percentage": 100,
            "battery_temperature": 25,
            "motor_speed_setting": 0,
            "is_charging": False,
            "last_update": datetime.now().isoformat()
        }
        db.collection('vehiclestate').document('current_state').set(initial_state)
        logger.info("New Firestore database created and initial document set")

create_current_state_document()

def calculate_power_consumption(speed_setting, battery_percentage):
    """Calculate power consumption based on speed setting and battery level"""
    if battery_percentage <= 0:
        return 0
    
    base_power = POWER_CONSUMPTION_RATE[speed_setting]
    battery_factor = max(0.5, battery_percentage / 100)  # Battery efficiency drops when low
    return base_power * battery_factor

def update_vehicle_state():
    """Background thread for realistic battery, temperature, and indicator simulation"""
    logger.info("Starting vehicle state update thread")
    last_broadcast = 0
    
    while True:
        try:
            current_time = time.time()
            
            if not vehicle_state['is_charging'] and vehicle_state['motor_speed_setting'] > 0:
                # Power consumption based on current state
                power_consumption = calculate_power_consumption(
                    vehicle_state['motor_speed_setting'],
                    vehicle_state['battery_percentage']
                )
                consumption_rate = power_consumption * 0.001 * 1  # Consumption rate per second
                
                # Update battery percentage
                vehicle_state['battery_percentage'] = max(
                    0,
                    vehicle_state['battery_percentage'] - consumption_rate
                )
                
                # Temperature simulation
                target_temp = MIN_TEMPERATURE + (
                    (MAX_TEMPERATURE - MIN_TEMPERATURE) * 
                    vehicle_state['motor_speed_setting'] / 4
                )
                
                if vehicle_state['battery_temperature'] < target_temp:
                    vehicle_state['battery_temperature'] = min(
                        target_temp,
                        vehicle_state['battery_temperature'] + 0.1
                    )
                
            elif vehicle_state['is_charging']:
                # Charging simulation
                charge_rate = 0.2  # 0.2% per second
                if vehicle_state['battery_percentage'] < 20:
                    charge_rate = 0.4  # Faster charging when battery is low
                
                vehicle_state['battery_percentage'] = min(
                    100,
                    vehicle_state['battery_percentage'] + charge_rate
                )
                
                # Temperature decreases during charging
                vehicle_state['battery_temperature'] = max(
                    MIN_TEMPERATURE,
                    vehicle_state['battery_temperature'] - 0.05
                )
            
            # Update indicator states
            vehicle_state['battery_low'] = vehicle_state['battery_percentage'] < MIN_BATTERY_THRESHOLD
            vehicle_state['motor_status'] = vehicle_state['motor_rpm'] > HIGH_RPM_THRESHOLD
            
            # Random state changes for parking brake and check engine
            if random.random() < 0.001:  # 0.1% chance per second
                vehicle_state['parking_brake'] = not vehicle_state['parking_brake']
                logger.info(f"Parking brake state changed to: {vehicle_state['parking_brake']}")
            
            if random.random() < 0.0005:  # 0.05% chance per second
                vehicle_state['check_engine'] = not vehicle_state['check_engine']
                logger.info(f"Check engine state changed to: {vehicle_state['check_engine']}")
            
            vehicle_state['last_update'] = datetime.now().isoformat()
            
            # Update Firestore
            doc_ref = db.collection('vehiclestate').document('current_state')
            doc_ref.set(vehicle_state)
            
            # Broadcast state update (if enough time has passed)
            if current_time - last_broadcast >= 5:
                # Implement real-time update mechanism (e.g., WebSocket, Server-Sent Events)
                last_broadcast = current_time
            
            time.sleep(1)
            
        except Exception as e:
            logger.error(f"Error in update thread: {e}")
            time.sleep(1)

# Initialize vehicle state
vehicle_state = {
    "parking_brake": False,
    "check_engine": False,
    "motor_status": False,
    "battery_low": False,
    "power": 0,
    "motor_rpm": 0,
    "gear_ratio": "N/N",
    "battery_percentage": 100,
    "battery_temperature": 25,
    "motor_speed_setting": 0,
    "is_charging": False,
    "last_update": datetime.now().isoformat()
}

# Start the update thread
update_thread = threading.Thread(target=update_vehicle_state, daemon=True)
update_thread.start()

@app.route('/')
def home():
    """Home route with API documentation"""
    return jsonify({
        "message": "Welcome to Vehicle Dashboard API",
        "version": "1.0",
        "endpoints": {
            "GET /api/vehicle/state": {
                "description": "Get current vehicle state",
                "returns": "JSON object with all vehicle parameters"
            },
            "POST /api/vehicle/motor-speed": {
                "description": "Set motor speed",
                "payload": {
                    "speed": "integer (0-4)"
                },
                "returns": "Success/Error message with current speed"
            },
            "POST /api/vehicle/charging": {
                "description": "Toggle charging state",
                "payload": {
                    "charging": "boolean"
                },
                "returns": "Success/Error message with charging state"
            },
            "POST /api/vehicle/reset": {
                "description": "Reset vehicle state",
                "returns": "Success message"
            }
        },
        "status": "API is running"
    })

@app.route('/api/vehicle/state', methods=['GET'])
def get_vehicle_state():
    """Get current vehicle state"""
    doc_ref = db.collection('vehiclestate').document('current_state')
    doc = doc_ref.get()
    if doc.exists:
        return jsonify(doc.to_dict())
    else:
        return jsonify({"error": "Vehicle state not found"}), 404

@app.route('/api/vehicle/motor-speed', methods=['POST'])
def set_motor_speed():
    """Set motor speed with realistic behavior"""
    try:
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        speed_setting = data.get('speed', 0)
        
        # Validate speed setting
        if speed_setting not in [0, 1, 2, 3, 4]:
            return jsonify({"error": "Invalid speed setting (must be 0-4)"}), 400
        
        # Check conditions
        if vehicle_state['is_charging']:
            return jsonify({"error": "Cannot change speed while charging"}), 400
        
        if vehicle_state['battery_percentage'] <= 0:
            return jsonify({"error": "Battery depleted"}), 400
        
        if vehicle_state['parking_brake']:
            return jsonify({"error": "Cannot operate motor while parking brake is engaged"}), 400
        
        # Update vehicle state
        vehicle_state['motor_speed_setting'] = speed_setting
        vehicle_state['motor_rpm'] = RPM_SETTINGS[speed_setting]
        vehicle_state['power'] = calculate_power_consumption(
            speed_setting,
            vehicle_state['battery_percentage']
        )
        vehicle_state['motor_status'] = vehicle_state['motor_rpm'] > HIGH_RPM_THRESHOLD
        vehicle_state['gear_ratio'] = GEAR_RATIOS[speed_setting]
        
        # Update Firestore
        doc_ref = db.collection('vehiclestate').document('current_state')
        doc_ref.set(vehicle_state)
        
        logger.info(f"Motor speed updated to: {speed_setting} (RPM: {vehicle_state['motor_rpm']})")
        return jsonify({
            "message": "Speed updated successfully",
            "current_speed": speed_setting,
            "rpm": vehicle_state['motor_rpm'],
            "power": vehicle_state['power']
        })
        
    except Exception as e:
        logger.error(f"Error setting motor speed: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/vehicle/charging', methods=['POST'])
def toggle_charging():
    """Toggle charging state with realistic behavior"""
    try:
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        is_charging = data.get('charging', False)
        
        # Validate charging conditions
        if vehicle_state['motor_speed_setting'] > 0 and is_charging:
            return jsonify({"error": "Cannot start charging while motor is running"}), 400
        
        if vehicle_state['battery_percentage'] >= 100 and is_charging:
            return jsonify({"error": "Battery is already full"}), 400
        
        # Update vehicle state
        vehicle_state['is_charging'] = is_charging
        if is_charging:
            vehicle_state['motor_speed_setting'] = 0
            vehicle_state['motor_rpm'] = 0
            vehicle_state['power'] = -5  # Negative power indicates charging
        else:
            vehicle_state['power'] = 0
        
        # Update Firestore
        doc_ref = db.collection('vehiclestate').document('current_state')
        doc_ref.set(vehicle_state)
        
        logger.info(f"Charging state changed to: {is_charging}")
        return jsonify({
            "message": "Charging state updated",
            "is_charging": is_charging,
            "battery_percentage": vehicle_state['battery_percentage']
        })
        
    except Exception as e:
        logger.error(f"Error toggling charging: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/vehicle/reset', methods=['POST'])
def reset_state():
    """Reset vehicle state to default values"""
    try:
        global vehicle_state
        vehicle_state = {
            "parking_brake": False,
            "check_engine": False,
            "motor_status": False,
            "battery_low": False,
            "power": 0,
            "motor_rpm": 0,
            "gear_ratio": "N/N",
            "battery_percentage": 100,
            "battery_temperature": 25,
            "motor_speed_setting": 0,
            "is_charging": False,
            "last_update": datetime.now().isoformat()
        }
        
        # Update Firestore
        doc_ref = db.collection('vehiclestate').document('current_state')
        doc_ref.set(vehicle_state)
        
        logger.info("Vehicle state reset to defaults")
        return jsonify({"message": "State reset successfully"})
        
    except Exception as e:
        logger.error(f"Error resetting state: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    if os.getenv('GAE_ENV', '').startswith('standard'):
        app.run()
    else:
        app.run(host='0.0.0.0', port=int(os.getenv('PORT', 8080)))