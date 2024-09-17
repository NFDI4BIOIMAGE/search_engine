from flask import Blueprint, jsonify, request, current_app
import logging
import os
import yaml
from elasticsearch import Elasticsearch

"""
Flask Blueprints :
Combining multiple functionalities
Maintain a clean architecture
Simplify deployment and scaling
"""
# Create a Blueprint for the index_data module
index_data_blueprint = Blueprint('index_data', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Elasticsearch connection
es_host = os.getenv('ELASTICSEARCH_HOST', 'localhost')
es_port = int(os.getenv('ELASTICSEARCH_PORT', 9200))
es = Elasticsearch('http://localhost:9200')

# Base path to the resources directory
base_path = '/resources'  # Updated path for Docker environment

# Function to delete the existing index
def delete_index(index_name):
    try:
        es.indices.delete(index=index_name, ignore=[400, 404])
        logger.info(f"Deleted existing index: {index_name}")
    except Exception as e:
        logger.error(f"Error deleting index {index_name}: {e}")

# Function to index YAML files
def index_yaml_files():
    # Automatically gather all YAML files in the resources directory
    yaml_files = [f for f in os.listdir(base_path) if f.endswith('.yml') or f.endswith('.yaml')]

    for file_name in yaml_files:
        file_path = os.path.join(base_path, file_name)
        try:
            with open(file_path, 'r') as file:
                content = yaml.safe_load(file)
                data = content.get('resources', [])
                logger.info(f"Indexing data from {file_path}")
                logger.info(f"Data read from file: {data}")  # Debugging statement
                if isinstance(data, list):
                    for item in data:
                        try:
                            # Ensure item is a dictionary
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

    # Refresh the index to make the newly indexed data searchable
    es.indices.refresh(index='bioimage-training')

# Flask route to return materials
@index_data_blueprint.route('/api/materials', methods=['GET'])
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

# Function to initialize the Elasticsearch index
def init_app():
    # Delete existing index and re-index YAML files when the app starts
    delete_index('bioimage-training')
    index_yaml_files()

# Note: No need for if __name__ == '__main__' block here, as the app is run from app.py
