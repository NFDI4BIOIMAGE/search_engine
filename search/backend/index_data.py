import json
from elasticsearch import Elasticsearch
from flask import Flask, jsonify, request
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Elasticsearch connection
es = Elasticsearch([{'host': 'localhost', 'port': 9200, 'scheme': 'http'}],
                   basic_auth=('admin', 'admin123'))

@app.route('/api/materials', methods=['GET'])
def get_materials():
    query = {
        "size": 1000,  # Adjust the size according to your needs
        "query": {
            "match_all": {}
        }
    }
    try:
        response = es.search(index='bioimage-training', body=query)
        materials = [doc['_source'] for doc in response['hits']['hits']]
        return jsonify(materials)
    except Exception as e:
        logger.error(f"Error fetching data from Elasticsearch: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
