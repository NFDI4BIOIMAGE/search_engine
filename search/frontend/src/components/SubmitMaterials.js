// src/components/SubmitMaterials.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubmitMaterials = () => {
  const [uniqueTags, setUniqueTags] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueLicenses, setUniqueLicenses] = useState([]);
  const [yamlFiles, setYamlFiles] = useState([]);
  const [formData, setFormData] = useState({
    authors: '',
    license: [],
    name: '',
    description: '',
    tags: [],
    type: [],
    url: '',
    yaml_file: ''
  });

  useEffect(() => {
    // Fetch unique values from Flask API
    axios.get('http://localhost:5000/api/get_unique_values')
      .then(response => {
        setUniqueTags(response.data.tags);
        setUniqueTypes(response.data.types);
        setUniqueLicenses(response.data.licenses);
      })
      .catch(error => console.error('Error fetching unique values:', error));

    // Fetch YAML files from Flask API
    axios.get('http://localhost:5000/api/get_yaml_files')
      .then(response => {
        setYamlFiles(response.data);
      })
      .catch(error => console.error('Error fetching YAML files:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    
    if (options) {  // Handle multiselect options
      const values = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData({
        ...formData,
        [name]: values
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/submit_material', formData)
      .then(response => alert('Submission successful'))
      .catch(error => console.error('Error submitting material:', error));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Submit New Training Materials</h2>
      <form onSubmit={handleSubmit}>
        {/* Authors */}
        <div className="mb-3">
          <label htmlFor="authors" className="form-label">Authors</label>
          <input type="text" name="authors" className="form-control" value={formData.authors} onChange={handleChange} placeholder="Enter authors" />
        </div>

        {/* Licenses */}
        <div className="mb-3">
          <label htmlFor="license" className="form-label">License</label>
          <select name="license" className="form-select" multiple value={formData.license} onChange={handleChange}>
            {uniqueLicenses.map((license, index) => (
              <option key={index} value={license}>{license}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="Enter name" />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} placeholder="Enter description"></textarea>
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags</label>
          <select name="tags" className="form-select" multiple value={formData.tags} onChange={handleChange}>
            {uniqueTags.map((tag, index) => (
              <option key={index} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Types */}
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <select name="type" className="form-select" multiple value={formData.type} onChange={handleChange}>
            {uniqueTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* URL */}
        <div className="mb-3">
          <label htmlFor="url" className="form-label">URL</label>
          <input type="text" name="url" className="form-control" value={formData.url} onChange={handleChange} placeholder="Enter URL" />
        </div>

        {/* YAML File */}
        <div className="mb-3">
          <label htmlFor="yaml_file" className="form-label">YAML File</label>
          <select name="yaml_file" className="form-select" value={formData.yaml_file} onChange={handleChange}>
            <option value="">Select a YAML file</option>
            {yamlFiles.map((file, index) => (
              <option key={index} value={file}>{file}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default SubmitMaterials;
