from flask import Flask, jsonify
from flask_cors import CORS
import logging
import os
import yaml
from elasticsearch import Elasticsearch

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Elasticsearch connection
es = Elasticsearch([{'host': 'localhost', 'port': 9200, 'scheme': 'http'}],
                   basic_auth=('admin', 'admin123'))

# Base path to the resources directory
base_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'resources')

# Function to delete the existing index
def delete_index(index_name):
    try:
        es.indices.delete(index=index_name, ignore=[400, 404])
        logger.info(f"Deleted existing index: {index_name}")
    except Exception as e:
        logger.error(f"Error deleting index {index_name}: {e}")

# Function to index YAML files
def index_yaml_files():
    yaml_files = [f for f in os.listdir(base_path) if f.endswith('.yml') or f.endswith('.yaml')]

    for file_name in yaml_files:
        file_path = os.path.join(base_path, file_name)
        try:
            with open(file_path, 'r') as file:
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

# Flask route to return materials using the Scroll API(more efficient for large datasets)
@app.route('/api/materials', methods=['GET'])
def get_materials():
    try:
        materials = []
        scroll_time = '2m'  # Time window for each scroll
        scroll_size = 1000   # Number of documents per scroll request

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

# Main entry point
if __name__ == '__main__':
    delete_index('bioimage-training')
    index_yaml_files()
    app.run(debug=True)
