# NFDI4BioImage Training Website Search Engine Improvement

This repository is based on the collection of training materials and related resources to enhance the search engine functionality of the NFDI4BioImage training website. The collection can be browsed at this URL:


It is maintained using [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) and [React](https://react.dev/learn)


To edit this Search Engine, install depencencies like this:

```
<!-- npm install xxx -->
```

To build the Search Engine, you can run this from the same folder (tested on Windows only):

```
..\search_engine\elasticsearch\bin
click to run elasticsearch.bat

cd ..\search_engine\search\backend
python index_data.py

cd ..\search_engine\search\frontend
npm start
```

Afterwards, there will be a `http://localhost:3000` website which should look like this:

<!-- ![](docs/how_to_use.png) -->
