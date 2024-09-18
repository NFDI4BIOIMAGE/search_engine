import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg'; 
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Modal, Button, Spinner } from 'react-bootstrap'; 

const SubmitMaterialsPage = () => {
  const [uniqueTags, setUniqueTags] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueLicenses, setUniqueLicenses] = useState([]);
  const [formData, setFormData] = useState({
    authors: '',
    license: [],
    name: '',
    description: '',
    tags: [],
    type: [],
    url: '',
    yaml_file: 'nfdi4bioimage.yml'  // Set default YAML file
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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

    // No need to fetch YAML files since we have only one
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
    setIsSubmitting(true);
    setShowModal(true); // Show modal immediately when submission starts
    setSubmissionStatus(null); // Reset status for a new submission

    let validationErrors = {};
    if (!formData.authors) validationErrors.authors = 'Authors are required';
    if (!formData.name) validationErrors.name = 'Title is required';
    if (!formData.url) validationErrors.url = 'URL is required';

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      setShowModal(false); // Close modal if there are errors
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/submit_material', formData);
      if (response.status === 201) {
        setSubmissionStatus('Submission successful');
        setFormData({
          authors: '',
          license: [],
          name: '',
          description: '',
          tags: [],
          type: [],
          url: '',
          yaml_file: 'nfdi4bioimage.yml'  // Reset to default YAML file
        });
      }
    } catch (error) {
      console.error('Error submitting material:', error);
      setSubmissionStatus('Error submitting material');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
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
            {hasLoaded ? (
              <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
                {/* License */}
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

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="Enter title"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Authors */}
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

                {/* Tags */}
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

                {/* Types */}
                <div className="mb-3">
                  <label className="form-label">Types</label>
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

                {/* Description */}
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

                {/* URL */}
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

                {/* Submit Button */}
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Submission Feedback */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Submission Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isSubmitting ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
              <span className="ms-2">Submitting...</span>
            </div>
          ) : (
            <p>{submissionStatus}</p>
          )}
        </Modal.Body>
        {!isSubmitting && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default SubmitMaterialsPage;
