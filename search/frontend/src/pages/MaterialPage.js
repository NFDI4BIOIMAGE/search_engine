import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg';
import FilterCard from '../components/FilterCard';

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [facets, setFacets] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Retrieve filters from localStorage when the component mounts
    const savedFilters = JSON.parse(localStorage.getItem('selectedFilters'));
    if (savedFilters) {
      setSelectedFilters(savedFilters);
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/materials', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Handle cases where materials might not have the expected structure
        const uniqueMaterialsMap = new Map();
        data.forEach(material => {
          if (material.url && !uniqueMaterialsMap.has(material.url)) {
            uniqueMaterialsMap.set(material.url, material);
          }
        });

        const uniqueMaterials = Array.from(uniqueMaterialsMap.values());

        setMaterials(uniqueMaterials);
        generateFacets(uniqueMaterials);
        setHasLoaded(true);
      } catch (error) {
        console.error("Error fetching the materials data:", error);
        setMaterials([]);
        setHasLoaded(true);
      }
    };

    fetchData();
  }, []);

  const generateFacets = (data) => {
    const authors = {};
    const publicationTitles = {}; // This will be derived from the "name" field
    const licenses = {};
    const types = {};
    const tags = {};

    data.forEach((item) => {
      if (item.authors) {
        item.authors.forEach(author => {
          authors[author] = (authors[author] || 0) + 1;
        });
      }
      if (item.name) { // Using the "name" field for publication titles
        publicationTitles[item.name] = (publicationTitles[item.name] || 0) + 1;
      }
      if (item.license) {
        const licenseArray = Array.isArray(item.license) ? item.license : [item.license];
        licenseArray.forEach(license => {
          licenses[license] = (licenses[license] || 0) + 1;
        });
      }
      if (item.type) {
        const typeArray = Array.isArray(item.type) ? item.type : [item.type];
        typeArray.forEach(type => {
          types[type] = (types[type] || 0) + 1;
        });
      }
      if (item.tags) {
        item.tags.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      }
    });

    setFacets({
      authors: Object.keys(authors).map(key => ({ key, doc_count: authors[key] })),
      publicationTitles: Object.keys(publicationTitles).map(key => ({ key, doc_count: publicationTitles[key] })),
      licenses: Object.keys(licenses).map(key => ({ key, doc_count: licenses[key] })),
      types: Object.keys(types).map(key => ({ key, doc_count: types[key] })),
      tags: Object.keys(tags).map(key => ({ key, doc_count: tags[key] })),
    });
  };

  const handleFilter = (field, value) => {
    const updatedFilters = { ...selectedFilters };
    if (updatedFilters[field]?.includes(value)) {
      updatedFilters[field] = updatedFilters[field].filter(item => item !== value);
    } else {
      updatedFilters[field] = [...(updatedFilters[field] || []), value];
    }
    setSelectedFilters(updatedFilters);
    localStorage.setItem('selectedFilters', JSON.stringify(updatedFilters)); // Save filters to localStorage
  };

  const filteredMaterials = materials.filter(material => {
    return Object.keys(selectedFilters).every(field => {
      return selectedFilters[field].length === 0 || selectedFilters[field].some(filterValue => {
        if (field === "publicationTitles") {
          return material.name === filterValue;
        }
        return Array.isArray(material[field]) ? material[field].includes(filterValue) : material[field] === filterValue;
      });
    });
  });

  return (
    <div>
      <div className="container-fluid py-5 mb-5 searchbar-header" style={{ position: 'relative', backgroundImage: `url(${bgSearchbar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
        <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white mb-3 animated slideInDown">Materials</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-3">
            <h3>Filter by</h3>
            <FilterCard title="Authors" items={facets.authors || []} field="authors" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Publication Titles" items={facets.publicationTitles || []} field="publicationTitles" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Licenses" items={facets.licenses || []} field="license" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Types" items={facets.types || []} field="type" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Tags" items={facets.tags || []} field="tags" selectedFilters={selectedFilters} handleFilter={handleFilter} />
          </div>

          <div className="col-md-9">
            {hasLoaded ? (
              <div className="materials-list">
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material, index) => (
                    <div key={index} className="material-item mb-3">
                      <h4>{material.name}</h4>
                      {material.authors && <p><strong>Authors:</strong> {material.authors.join(', ')}</p>}
                      <p><strong>License:</strong> {Array.isArray(material.license) ? material.license.join(', ') : material.license}</p>
                      <p><strong>Type:</strong> {Array.isArray(material.type) ? material.type.join(', ') : material.type}</p>
                      <p><strong>Tags:</strong> {material.tags?.join(', ')}</p>
                      <p><strong>URL:</strong> <a href={material.url} target="_blank" rel="noopener noreferrer">{material.url}</a></p>
                    </div>
                  ))
                ) : (
                  <p>No materials found with the current filters.</p>
                )}
              </div>
            ) : (
              <p>Loading materials...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPage;
