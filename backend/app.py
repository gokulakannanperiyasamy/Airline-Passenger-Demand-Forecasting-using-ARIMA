from flask import Flask, jsonify
from flask_cors import CORS
import pickle
import json
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'model/arima_model.pkl'
METRICS_PATH = 'model/metrics.json'
FORECAST_PATH = 'model/forecast.json'

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    if not os.path.exists(FORECAST_PATH):
        return jsonify({"error": "Model not trained yet"}), 503
    
    with open(FORECAST_PATH, 'r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    if not os.path.exists(METRICS_PATH):
        return jsonify({"error": "Model not trained yet"}), 503
        
    with open(METRICS_PATH, 'r') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
