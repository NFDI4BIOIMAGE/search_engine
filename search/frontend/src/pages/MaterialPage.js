import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg';
import FilterCard from '../components/FilterCard';

// MaterialPage Component
// This component fetches, filters, and displays a list of materials from an external data source.
// It allows users to filter materials by license, type, and tags using a faceted search interface.

const MaterialPage = () => {
  // State to hold the list of materials
  const [materials, setMaterials] = useState([]);
  // State to hold the facets (filters) data
  const [facets, setFacets] = useState({});
  // State to hold the selected filters
  const [selectedFilters, setSelectedFilters] = useState({});
  // State to track whether the data has been loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // useEffect to fetch materials data from the external source when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:9200/bioimage-training/_search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:admin123'), // Authentication header
          },
          body: JSON.stringify({
            "size": 1000, // Request to fetch up to 1000 materials
            "query": {
              "match_all": {} // Query to fetch all documents
            }
          })
        });
        const data = await response.json();

        // Create a map to ensure uniqueness of materials by URL
        const uniqueMaterialsMap = new Map();
        data.hits.hits.forEach(hit => {
          const material = hit._source;
          if (material.url && !uniqueMaterialsMap.has(material.url)) {
            uniqueMaterialsMap.set(material.url, material);
          }
        });

        // Convert the map back to an array of unique materials
        const uniqueMaterials = Array.from(uniqueMaterialsMap.values());

        setMaterials(uniqueMaterials); // Set the unique materials to state
        generateFacets(uniqueMaterials); // Generate facets based on the materials
        setHasLoaded(true); // Mark the data as loaded
      } catch (error) {
        console.error("Error fetching the materials data:", error); // Handle any errors during fetch
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  // Function to generate facets for filtering based on the materials data
  const generateFacets = (data) => {
    const licenses = {};
    const types = {};
    const tags = {};

    // Loop through the materials to generate counts for each facet category
    data.forEach((item) => {
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

    // Set the generated facets data into state
    setFacets({
      licenses: Object.keys(licenses).map(key => ({ key, doc_count: licenses[key] })),
      types: Object.keys(types).map(key => ({ key, doc_count: types[key] })),
      tags: Object.keys(tags).map(key => ({ key, doc_count: tags[key] })),
    });
  };

  // Function to handle filter selection and update the selected filters state
  const handleFilter = (field, value) => {
    const updatedFilters = { ...selectedFilters };
    if (updatedFilters[field]?.includes(value)) {
      updatedFilters[field] = updatedFilters[field].filter(item => item !== value); // Remove filter if already selected
    } else {
      updatedFilters[field] = [...(updatedFilters[field] || []), value]; // Add filter if not selected
    }
    setSelectedFilters(updatedFilters); // Update the selected filters state
  };

  // Filter the materials based on the selected filters
  const filteredMaterials = materials.filter(material => {
    return Object.keys(selectedFilters).every(field => {
      return selectedFilters[field].length === 0 || selectedFilters[field].includes(material[field]);
    });
  });

  return (
    <div>
      {/* SearchBar Section Start */}
      {/* This section displays the search bar header with a background image */}
      <div className="container-fluid py-5 mb-5 searchbar-header" style={{ position: 'relative', backgroundImage: `url(${bgSearchbar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div> {/* Semi-transparent overlay */}
        <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white mb-3 animated slideInDown">Materials</h1>
            </div>
          </div>
        </div>
      </div>
      {/* SearchBar Section End */}

      <div className="container my-5">
        <div className="row">
          {/* Faceted Search Sidebar Start */}
          {/* This section displays the sidebar for filtering materials by license, type, and tags */}
          <div className="col-md-3">
            <h3>Filter by</h3>
            <FilterCard title="Licenses" items={facets.licenses || []} field="license" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Types" items={facets.types || []} field="type" selectedFilters={selectedFilters} handleFilter={handleFilter} />
            <FilterCard title="Tags" items={facets.tags || []} field="tags" selectedFilters={selectedFilters} handleFilter={handleFilter} />
          </div>
          {/* Faceted Search Sidebar End */}

          {/* Materials Section Start */}
          {/* This section displays the list of materials, filtered based on the user's selections */}
          <div className="col-md-9">
            {hasLoaded ? (
              <div className="materials-list">
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material, index) => (
                    <div key={index} className="material-item">
                  <h4>{material.name}</h4>
                    {material.authors && <p><strong>Authors:</strong> {material.authors.join(', ')}</p>}
                    <p><strong>License:</strong> {Array.isArray(material.license) ? material.license.join(', ') : material.license}</p>
                    <p><strong>Type:</strong> {Array.isArray(material.type) ? material.type.join(', ') : material.type}</p>
                    <p><strong>Tags:</strong> {material.tags?.join(', ')}</p>
                    <p><strong>URL:</strong> <a href={material.url} target="_blank" rel="noopener noreferrer">{material.url}</a></p> {/* Make URL clickable */}
                  </div>
                  ))
                ) : (
                  <p>No materials found with the current filters.</p>
                )}
              </div>
            ) : (
              <p>Loading materials...</p> // Display a loading message while the data is being fetched
            )}
          </div>
          {/* Materials Section End */}
        </div>
      </div>
    </div>
  );
};

export default MaterialPage;
