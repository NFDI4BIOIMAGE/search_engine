import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg'; // Make sure this path is correct for your image
import axios from 'axios';

const SubmitMaterialsPage = () => {
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
  const [hasLoaded, setHasLoaded] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            <h2 className="mb-4">Submit New Training Materials</h2>
            {submissionStatus && <p className="text-info">{submissionStatus}</p>}
            {hasLoaded ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Authors</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="authors" 
                    value={formData.authors} 
                    onChange={handleChange} 
                    placeholder="Enter authors"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">License</label>
                  <select 
                    className="form-select" 
                    name="license" 
                    value={formData.license} 
                    onChange={handleChange} 
                    multiple
                  >
                    {uniqueLicenses.map((license, index) => (
                      <option key={index} value={license}>{license}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Enter description"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <select 
                    className="form-select" 
                    name="tags" 
                    value={formData.tags} 
                    onChange={handleChange} 
                    multiple
                  >
                    {uniqueTags.map((tag, index) => (
                      <option key={index} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select 
                    className="form-select" 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    multiple
                  >
                    {uniqueTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    name="url" 
                    value={formData.url} 
                    onChange={handleChange} 
                    placeholder="Enter URL"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">YAML File</label>
                  <select 
                    className="form-select" 
                    name="yaml_file" 
                    value={formData.yaml_file} 
                    onChange={handleChange}
                  >
                    {yamlFiles.map((file, index) => (
                      <option key={index} value={file}>{file}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
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
