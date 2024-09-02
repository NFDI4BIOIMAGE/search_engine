from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import yaml
import time
from github import Github
from pathlib import Path
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React frontend

def load_yaml_data(file_path):
    """
    Load YAML data from a file and modify it based on certain conditions.
    """
    try:
        with open(file_path, 'r', encoding="utf8") as file:
            data = yaml.safe_load(file)
            app.logger.info(f"Loaded data from {file_path}: {data}")
            
            # Check for 'url' in data and append 'zenodo' to tags if the condition is met
            if "url" in data and "zenodo" in str(data["url"]).lower():
                if 'tags' in data and isinstance(data['tags'], list):
                    data["tags"].append("zenodo")
                else:
                    data['tags'] = ["zenodo"]
            
            return data
    except Exception as e:
        app.logger.error(f"Error loading YAML data from {file_path}: {e}")
        return None  # Return None in case of error

def all_content(directory_path):
    """
    Load all YAML data from a directory into a list of dictionaries.
    """
    try:
        resources = []
        for yaml_file in Path(directory_path).glob('*.yml'):
            yaml_data = load_yaml_data(yaml_file)
            if yaml_data and 'resources' in yaml_data:
                resources.extend(yaml_data['resources'])
            else:
                app.logger.warning(f"No 'resources' key found in file {yaml_file} or file is empty.")
        app.logger.info(f"All content loaded: {resources}")
        return {'resources': resources}
    except Exception as e:
        app.logger.error(f"Error loading content from directory {directory_path}: {e}")
        return {'resources': []}  # Return empty list in case of error

@app.route('/api/get_unique_values', methods=['GET'])
def get_unique_values_from_yamls():
    """
    Get unique tags, types, and licenses from YAML files using pandas for data processing.
    """
    # Adjust the path to the correct resources directory
    resources_dir = Path(__file__).resolve().parents[2] / 'resources'
    app.logger.info(f"Loading resources from directory: {resources_dir}")
    
    content = all_content(resources_dir)
    
    if not content['resources']:
        app.logger.warning("No resources found in the YAML files.")
        return jsonify({'tags': [], 'types': [], 'licenses': []})
    
    df = pd.DataFrame(content['resources'])

    # Handle cases where 'tags', 'type', and 'license' might not be present or not lists
    df['tags'] = df['tags'].apply(lambda x: x if isinstance(x, list) else [])
    df['type'] = df['type'].apply(lambda x: [x] if isinstance(x, str) else x if isinstance(x, list) else ['Unknown'])
    df['license'] = df['license'].apply(lambda x: [x] if isinstance(x, str) else x if isinstance(x, list) else [])

    # Extract unique values
    unique_tags = sorted(set(tag for sublist in df['tags'] for tag in sublist))
    unique_types = sorted(set(t for sublist in df['type'] for t in sublist))
    unique_licenses = sorted(set(l for sublist in df['license'] for l in sublist))

    app.logger.info(f"Unique Tags: {unique_tags}")
    app.logger.info(f"Unique Types: {unique_types}")
    app.logger.info(f"Unique Licenses: {unique_licenses}")

    return jsonify({
        'tags': unique_tags,
        'types': unique_types,
        'licenses': unique_licenses
    })

@app.route('/api/get_yaml_files', methods=['GET'])
def get_yaml_files():
    """
    List YAML files in a directory.
    """
    resources_dir = Path(__file__).resolve().parents[2] / 'resources'
    app.logger.info(f"Listing YAML files from directory: {resources_dir}")
    yaml_files = sorted([str(yaml_file.name) for yaml_file in Path(resources_dir).glob('*.yml')])
    return jsonify(yaml_files)


@app.route('/api/materials', methods=['GET'])
def get_materials():
    """
    Endpoint to fetch all materials.
    """
    # Adjust the path to the correct resources directory
    resources_dir = Path(__file__).resolve().parents[2] / 'resources'
    app.logger.info(f"Loading materials from directory: {resources_dir}")
    
    content = all_content(resources_dir)
    
    if not content['resources']:
        app.logger.warning("No resources found in the YAML files.")
        return jsonify([])  # Return an empty list if no resources are found
    
    materials = content['resources']  # Assuming all materials are stored under 'resources' key
    
    return jsonify(materials)


def get_github_repository(repository):
    """
    Get the GitHub repository object.
    """
    access_token = os.getenv('GITHUB_API_KEY')
    
    if not access_token:
        raise Exception("GitHub API Key is not set in the environment variables.")

    g = Github(access_token)

    return g.get_repo(repository)

@app.route('/api/submit_material', methods=['POST'])
def submit_material():
    """
    Endpoint to handle the submission of new training materials.
    """
    data = request.json
    authors = data.get('authors')
    license = data.get('license')
    name = data.get('name')
    description = data.get('description')
    tags = data.get('tags')
    type_ = data.get('type')
    url = data.get('url')
    yaml_file = data.get('yaml_file')

    repo = get_github_repository("SeverusYixin/Test_Appsubmitter")
    try:
        create_pull_request(repo, yaml_file, authors, license, name, description, tags, type_, url)
        return jsonify({"message": "Pull request created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_pull_request(repo, yaml_file, authors, license, name, description, tags, type_, url):
    """
    Create a pull request to add a new entry to a YAML file on GitHub.
    """
    try:
        file_path = f"resources/{yaml_file}"
        file_contents = repo.get_contents(file_path)
        yaml_content = file_contents.decoded_content.decode('utf-8')
        yaml_data = yaml.safe_load(yaml_content)
        new_entry = {
            'authors': authors,
            'license': license,
            'name': name,
            'description': description,
            'tags': tags,
            'type': type_,
            'url': url
        }
        if 'resources' in yaml_data:
            yaml_data['resources'].append(new_entry)
        else:
            yaml_data['resources'] = [new_entry]
        new_yaml_content = yaml.safe_dump(yaml_data, allow_unicode=True, sort_keys=False)
        base_branch = repo.get_branch("main")
        timestamp = int(time.time())
        branch_name = f"update-{yaml_file.split('.')[0]}-{timestamp}".replace(' ', '-')
        repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base_branch.commit.sha)
        repo.update_file(file_path, f"Add new entry", new_yaml_content, file_contents.sha, branch=branch_name)
        pr_title = f"Add new training materials request to {yaml_file}"
        pr_body = "Added new training materials."
        repo.create_pull(title=pr_title, body=pr_body, head=branch_name, base='main')
    except Exception as e:
        raise Exception(f"Failed to update YAML file and create pull request: {e}")

if __name__ == '__main__':
    app.run(debug=True)
