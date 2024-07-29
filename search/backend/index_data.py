import json
import yaml
import logging
from elasticsearch import Elasticsearch
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

es = Elasticsearch([{'host': 'localhost', 'port': 9200, 'scheme': 'http'}],
                   basic_auth=('admin', 'admin123')
)

# Base path to the resources directory
base_path = os.path.join(os.path.dirname(__file__), '..', '..', 'resources')

# List of YAML files to index
yaml_files = [
    'blog_posts.yml',
    'events.yml',
    'materials.yml',
    'nfdi4bioimage.yml',
    'papers.yml',
    'workflow-tools.yml',
    'youtube_channels.yml'
]

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

logger.info("Data indexing complete.")
