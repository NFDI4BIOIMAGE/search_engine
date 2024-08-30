import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg'; // Ensure this path is correct for your image
import axios from 'axios';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable'; // Import CreatableSelect

const SubmitMaterialsPage = () => {
  const [uniqueTags, setUniqueTags] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueLicenses, setUniqueLicenses] = useState([]);
  const [yamlFiles, setYamlFiles] = useState([]);
  const [formData, setFormData] = useState({
    authors: '',
    license: [], // Now an array to handle multiple selections
    name: '',
    description: '',
    tags: [], // Now an array to handle multiple selections and custom input
    type: [], // Already an array
    url: '',
    yaml_file: ''
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errors, setErrors] = useState({}); // State to handle validation errors

  useEffect(() => {
    // Fetch unique values from Flask API
    axios.get('http://localhost:5000/api/get_unique_values')
      .then(response => {
        setUniqueTags(response.data.tags);
        setUniqueTypes(response.data.types);
        setUniqueLicenses(response.data.licenses);
        setHasLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching unique values:', error);
        setHasLoaded(true);
      });

    // Fetch YAML files from Flask API
    axios.get('http://localhost:5000/api/get_yaml_files')
      .then(response => {
        setYamlFiles(response.data);
      })
      .catch(error => console.error('Error fetching YAML files:', error));
  }, []);

  const handleChange = (selectedOptions, actionMeta) => {
    setFormData({
      ...formData,
      [actionMeta.name]: selectedOptions ? selectedOptions.map(option => option.value) : []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    let validationErrors = {};
    if (!formData.authors) validationErrors.authors = 'Authors are required';
    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.url) validationErrors.url = 'URL is required';

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // If there are errors, do not submit the form
    }

    try {
      const response = await axios.post('http://localhost:5000/api/submit_material', formData);
      if (response.status === 201) {
        alert('Submission successful');
        setSubmissionStatus('Submission successful');
      }
    } catch (error) {
      console.error('Error submitting material:', error);
      setSubmissionStatus('Error submitting material');
    }
  };

  return (
    <div>
      {/* Top section with background image */}
      <div 
        className="container-fluid py-5 mb-5 searchbar-header" 
        style={{ 
          backgroundImage: `url(${bgSearchbar})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          position: 'relative'
        }}
      >
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0, 0, 0, 0.1)' 
        }}></div>
        <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white mb-3 animated slideInDown">Submit Materials</h1>
              <p className="fs-4 text-white mb-4 animated slideInDown">Contribute to NFDI4BioImage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main form section */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="mb-4 text-center">Submit New Training Materials</h2>
            {submissionStatus && <p className="text-info text-center">{submissionStatus}</p>}
            {hasLoaded ? (
              <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
                <div className="mb-3">
                  <label className="form-label">Authors</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.authors ? 'is-invalid' : ''}`} 
                    name="authors" 
                    value={formData.authors} 
                    onChange={handleInputChange}
                    placeholder="Enter authors"
                  />
                  {errors.authors && <div className="invalid-feedback">{errors.authors}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">License</label>
                  <Select
                    isMulti
                    name="license"
                    options={uniqueLicenses.map(license => ({ value: license, label: license }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={uniqueLicenses
                      .filter(license => formData.license.includes(license))
                      .map(license => ({ value: license, label: license }))}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows="4"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <CreatableSelect
                    isMulti
                    name="tags"
                    options={uniqueTags.map(tag => ({ value: tag, label: tag }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={formData.tags.map(tag => ({ value: tag, label: tag }))}
                    onChange={handleChange}
                    placeholder="Select or type tags..."
                    noOptionsMessage={() => "Type to create a new tag"}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <Select
                    isMulti
                    name="type"
                    options={uniqueTypes.map(type => ({ value: type, label: type }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={uniqueTypes
                      .filter(type => formData.type.includes(type))
                      .map(type => ({ value: type, label: type }))}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL</label>
                  <input 
                    type="url" 
                    className={`form-control ${errors.url ? 'is-invalid' : ''}`} 
                    name="url" 
                    value={formData.url} 
                    onChange={handleInputChange}
                    placeholder="Enter URL"
                  />
                  {errors.url && <div className="invalid-feedback">{errors.url}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">YAML File</label>
                  <select 
                    className="form-select" 
                    name="yaml_file" 
                    value={formData.yaml_file} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select a YAML file</option>
                    {yamlFiles.map((file, index) => (
                      <option key={index} value={file}>{file}</option>
                    ))}
                  </select>
                </div>
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitMaterialsPage;
