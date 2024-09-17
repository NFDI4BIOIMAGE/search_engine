from flask import Flask
from flask_cors import CORS
from submitter import submitter_blueprint
from index_data import index_data_blueprint

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(submitter_blueprint)
app.register_blueprint(index_data_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
 
