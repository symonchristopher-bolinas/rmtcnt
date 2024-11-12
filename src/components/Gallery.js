import React from 'react';
import '../styles/gallery.css';

const Gallery = () => {
  return (
    <div className="container">
      <div className="textgallery12">
        Featured
      </div>
      <div className="row">
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
          <img src={require('../images/gallery/1.jpg')} alt="Image 1" className="gallery-image"   />
            <div className="description">Description for Image 1</div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/2.jpg')} alt="Image 2" className="gallery-image"  />
            <div className="description">Description for Image 2</div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/3.jpg')} alt="Image 3" className="gallery-image"  />
            <div className="description">Description for Image 3</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/4.jpg')} alt="Image 4" className="gallery-image" />
            <div className="description">Description for Image 4</div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/5.jpg')} alt="Image 5" className="gallery-image"  />
            <div className="description">Description for Image 5</div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/6.jpg')} alt="Image 6" className="gallery-image"  />
            <div className="description">Description for Image 6</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/7.jpg')} alt="Image 7" className="gallery-image"  />
            <div className="description">Description for Image 7</div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/8.jpg')} alt="Image 8" className="gallery-image"  />
            <div className="description">Description for Image 8</div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="gallery-item">
            <img src={require('../images/gallery/9.jpg')} alt="Image 9" className="gallery-image"  />
            <div className="description">Description for Image 9</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
