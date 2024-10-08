from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import os
import yaml
from elasticsearch import Elasticsearch, ConnectionError
from pathlib import Path
import time

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Base path to the resources directory inside the Docker container
base_path = Path('/app/resources')

def connect_elasticsearch():
    es = None
    max_attempts = 60  # Increase the number of attempts
    for attempt in range(max_attempts):
        try:
            es = Elasticsearch(
                [{'host': 'elasticsearch', 'port': 9200, 'scheme': 'http'}],
                timeout=30  # Increase timeout for each request
            )
            if es.ping():
                logger.info("Connected to Elasticsearch")
                return es
            else:
                logger.error("Elasticsearch ping failed")
        except ConnectionError:
            logger.error(f"Elasticsearch not ready, attempt {attempt+1}/{max_attempts}, retrying in 10 seconds...")
            time.sleep(10)  # Increase the interval between retries
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            time.sleep(10)
    raise Exception("Could not connect to Elasticsearch after several attempts")

es = connect_elasticsearch()

# Function to delete the existing index
def delete_index(index_name):
    try:
        es.indices.delete(index=index_name, ignore=[400, 404])
        logger.info(f"Deleted existing index: {index_name}")
    except Exception as e:
        logger.error(f"Error deleting index {index_name}: {e}")

# Function to index YAML files
def index_yaml_files():
    try:
        yaml_files = [f for f in os.listdir(base_path) if f.endswith('.yml') or f.endswith('.yaml')]

        for file_name in yaml_files:
            file_path = base_path / file_name
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = yaml.safe_load(file)
                    data = content.get('resources', [])
                    logger.info(f"Indexing data from {file_path}")
                    if isinstance(data, list):
                        for item in data:
                            try:
                                if isinstance(item, dict):
                                    es.index(index='bioimage-training', body=item)
                                    logger.info(f"Indexed item: {item}")
                                else:
                                    logger.error(f"Item is not a dictionary: {item}")
                            except Exception as e:
                                logger.error(f"Error indexing item: {item} - {e}")
                    else:
                        logger.error(f"Data is not a list: {data}")
            except FileNotFoundError as e:
                logger.error(f"File not found: {file_path} - {e}")
            except yaml.YAMLError as e:
                logger.error(f"Error reading YAML file: {file_path} - {e}")

        es.indices.refresh(index='bioimage-training')

    except Exception as e:
        logger.error(f"Error indexing YAML files: {e}")

# Flask route to return materials using the Scroll API (more efficient for large datasets)
@app.route('/api/materials', methods=['GET'])
def get_materials():
    try:
        materials = []
        scroll_time = '2m'  # Time window for each scroll
        scroll_size = 1000  # Number of documents per scroll request

        # Initial request for the first scroll
        response = es.search(
            index='bioimage-training',
            scroll=scroll_time,
            size=scroll_size,
            body={"query": {"match_all": {}}}
        )

        # Get the scroll ID and first batch of results
        scroll_id = response['_scroll_id']
        materials += [doc['_source'] for doc in response['hits']['hits']]

        # Keep fetching while there are still results
        while len(response['hits']['hits']) > 0:
            response = es.scroll(scroll_id=scroll_id, scroll=scroll_time)
            scroll_id = response['_scroll_id']
            materials += [doc['_source'] for doc in response['hits']['hits']]

        return jsonify(materials)

    except Exception as e:
        logger.error(f"Error fetching data from Elasticsearch: {e}")
        return jsonify({"error": str(e)}), 500

# Flask route for search functionality
@app.route('/api/search', methods=['GET'])
def search():
    try:
        query = request.args.get('q', '')  # Get search query from the request
        es_response = es.search(
            index='bioimage-training',
            body={
                "query": {
                    "query_string": {
                        "query": f"*{query}*",
                        "fields": ["name", "description", "tags", "authors", "type", "license", "url"],
                        "default_operator": "AND"
                    }
                }
            },
            size=1000  # Retrieve up to 1000 results
        )
        return jsonify(es_response['hits']['hits'])
    except Exception as e:
        logger.error(f"Error searching in Elasticsearch: {e}")
        return jsonify({"error": str(e)}), 500

# Main entry point
if __name__ == '__main__':
    delete_index('bioimage-training')
    index_yaml_files()
    app.run(host='0.0.0.0', port=5000, debug=True)
