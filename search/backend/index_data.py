import json
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': 'localhost', 'port': 9200, 'scheme': 'http'}],
                   basic_auth=('admin', 'admin123')
)

with open('data.json', 'r') as file:
    data = json.load(file)
    for item in data:
        es.index(index='bioimage-training', body=item)
