import React from 'react';
import SearchBar from '../components/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import bgSearchbar from '../assets/images/bg-searchbar.jpg';

const HomePage = ({ handleSearch }) => (
  <div>
    {/* Searchbar Section Start */}
    <div className="container-fluid py-5 mb-5 searchbar-header" style={{ backgroundImage: `url(${bgSearchbar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container py-5">
        <div className="row justify-content-center py-5">
          <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
            <h1 className="display-3 text-white mb-3 animated slideInDown">Welcome to NFDI4BioImage</h1>
            <p className="fs-4 text-white mb-4 animated slideInDown">A consortium of the National Research Data Infrastructure</p>
            <div className="position-relative w-75 mx-auto animated slideInDown">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Searchbar Section End */}

    {/* About Section Start */}
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" style={{ minHeight: '400px' }}>
            <div className="position-relative h-100">
              <img className="img-fluid position-absolute w-100 h-100" src="path-to-about-image" alt="" style={{ objectFit: 'cover' }} />
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
            <h6 className="section-title bg-white text-start text-primary pe-3">About Us</h6>
            <h1 className="mb-4">What is <span className="text-primary">NFDI4BioImage</span></h1>
            <p className="mb-4">NFDI4BIOIMAGE is a consortium of the National Research Data Infrastructure (Nationale Forschungsdateninfrastruktur, NFDI) in Germany. A consortium comprises legally independent partner institutions working together with the goal to advance the capacity and the capability of researchers in Germany and beyond to professionally handle, store, annotate, share, and reuse research data. Our focus is on all steps of the research data life cycle for microscopy and bioimage analysis. The NFDI4BIOIMAGE consortium is funded by Deutsche Forschungsgemeinschaft (DFG, German Research Foundation) since March 2023.</p>
            <p className="mb-4">Hmmm some Introductions?</p>
            <div className="row gy-2 gx-4 mb-4">
              <div className="col-sm-6">
                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Add something?</p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Add something?</p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Add something?</p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Add something?</p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Add something?</p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Add something?</p>
              </div>
            </div>
            <a className="btn btn-primary py-3 px-5 mt-2" href="">Read More</a>
          </div>
        </div>
      </div>
    </div>
    {/* About Section End */}
  </div>
);

export default HomePage;
