import React, { useState } from 'react';
import './blogslider.css'; 

function TreeProtection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(0); // State to track selected topic

  const toggleContent = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const handleTopicSelect = (index) => {
    setSelectedTopic(index === selectedTopic ? null : index); // Toggle selected topic
  };


  return (
    <>
      <h2 className="center">How to Protect your Trees</h2>
      <hr />
      <div className="container" id='TPblog'>
        <div className="row">
          <div className="col-md-6">
            <div className="wrapper" id='blogwrapper'>
              <button
                className="toggle"
                onClick={() => toggleContent(0)}
                style={{ color: openIndex === 0 ? '#0c581d' : '#111130' }}>
                1st Topic
                <i className={`fas ${openIndex === 0 ? 'fa-minus' : 'fa-plus'} icon`}></i>
              </button>
              <div
                className="content" id='blogcontent'
                style={{
                  height: openIndex === 0 ? 'auto' : '0px',
                  opacity: openIndex === 0 ? '1' : '0',
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta aliquam facere
                  adipisci quod mollitia, aut nemo deleniti fugiat et, corrupti sequi. Omnis
                  dolorem quos eligendi placeat soluta sint corrupti quod.
                </p>
              </div>
            </div>
            <div className="wrapper" id='blogwrapper'>
            <button
                className="toggle"
                onClick={() => toggleContent(1)}
                style={{ color: openIndex === 1 ? '#0c581d' : '#111130' }}>
                    2nd Topic
                    <i className={`fas ${openIndex === 1 ? 'fa-minus' : 'fa-plus'} icon`}></i>
                </button>
                <div
                className="content" id='blogcontent'
                style={{
                  height: openIndex === 1? 'auto' : '0px',
                  opacity: openIndex === 1 ? '1' : '0',
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta aliquam facere
                  adipisci quod mollitia, aut nemo deleniti fugiat et, corrupti sequi. Omnis
                  dolorem quos eligendi placeat soluta sint corrupti quod.
                </p>
              </div>
            </div>           
             <div className="wrapper" id='blogwrapper'>
            <button
                className="toggle"
                onClick={() => toggleContent(2)}
                style={{ color: openIndex === 2 ? '#0c581d' : '#111130' }}>
                    3rd Topic
                    <i className={`fas ${openIndex === 2 ? 'fa-minus' : 'fa-plus'} icon`}></i>
                </button>
                <div
                className="content" id='blogcontent'
                style={{
                  height: openIndex === 2? 'auto' : '0px',
                  opacity: openIndex === 2 ? '1' : '0',
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta aliquam facere
                  adipisci quod mollitia, aut nemo deleniti fugiat et, corrupti sequi. Omnis
                  dolorem quos eligendi placeat soluta sint corrupti quod.
                </p>
              </div>
            </div>
            <div className="wrapper" id='blogwrapper'>
            <button
                className="toggle"
                onClick={() => toggleContent(3)}
                style={{ color: openIndex === 3 ? '#0c581d' : '#111130' }}>
                    4th Topic
                    <i className={`fas ${openIndex === 3 ? 'fa-minus' : 'fa-plus'} icon`}></i>
                </button>
                <div
                className="content" id='blogcontent'
                style={{
                  height: openIndex === 3? 'auto' : '0px',
                  opacity: openIndex === 3 ? '1' : '0',
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta aliquam facere
                  adipisci quod mollitia, aut nemo deleniti fugiat et, corrupti sequi. Omnis
                  dolorem quos eligendi placeat soluta sint corrupti quod.
                </p>
              </div>
            </div>
            {/* Repeat the above structure for other topics */}
          </div>

          <div className="col-md-6">
            <div className="wrapper1">
              <div className="container" id='TPblog'>
                {/* Radio buttons and labels */}
                {[1].map((index) => (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      className='inputTP'
                      name="slide"
                      id={`c${index}`}
                      checked={selectedTopic === index}
                      onChange={() => handleTopicSelect(index)}
                    />
                    <label htmlFor={`c${index}`} className="card" id='c1234'>
                        <div className="row">
                            <div className="icon">1</div>
                            <div className="description">
                                <h4>Topic 1</h4>
                                <p>Topic 1 paragraph</p>
                            </div>
                        </div>
                    </label>
                    </React.Fragment>))}
                    {[2].map((index) => (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      className='inputTP'
                      name="slide"
                      id={`c${index}`}
                      checked={selectedTopic === index}
                      onChange={() => handleTopicSelect(index)}
                    />
                    <label htmlFor={`c${index}`} className="card" id='c1234'>
                        <div className="row">
                            <div className="icon">2</div>
                            <div className="description">
                                <h4>Topic 2</h4>
                                <p>Topic 2 paragraph</p>
                            </div>
                        </div>
                    </label></React.Fragment>))}
                    {[3].map((index) => (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      className='inputTP'
                      name="slide"
                      id={`c${index}`}
                      checked={selectedTopic === index}
                      onChange={() => handleTopicSelect(index)}
                    />
                    <label htmlFor={`c${index}`} className="card" id='c1234'>
                        <div className="row">
                            <div className="icon">3</div>
                            <div className="description">
                                <h4>Topic 3</h4>
                                <p>Topic 3 paragraph</p>
                            </div>
                        </div>
                    </label></React.Fragment>))}
                    {[4].map((index) => (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      className='inputTP'
                      name="slide"
                      id={`c${index}`}
                      checked={selectedTopic === index}
                      onChange={() => handleTopicSelect(index)}
                    />
                    <label htmlFor={`c${index}`} className="card" id='c1234'>
                        <div className="row">
                            <div className="icon">4</div>
                            <div className="description">
                                <h4>Topic 4</h4>
                                <p>Topic 4 paragraph</p>
                            </div>
                        </div>
                    </label></React.Fragment>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TreeProtection;
