import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import '../pages/Blog/blogslider.css'; 

function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [error, setError] = useState(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [backgroundImages, setBackgroundImages] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data: faqsData, error: faqsError } = await supabase.from('faqs').select('*');
        if (faqsError) throw faqsError;
        setFaqs(faqsData);

        // Fetch other data like header title and background images
        const { data: headerData, error: headerError } = await supabase.from('faqs').select('*').single();
        if (headerError) throw headerError;
        setHeaderTitle(headerData.title);

        const { data: backgroundImageData, error: backgroundImageError } = await supabase.from('faqs').select('*');
        if (backgroundImageError) throw backgroundImageError;
        setBackgroundImages(backgroundImageData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      }
    };
    fetchFaqs();
  }, []);

  const toggleContent = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTopicSelect = (index) => {
    setSelectedTopic(index === selectedTopic ? null : index);
  };

  return (
    <>
    <div className='containerfaqs'>
      <h2 className="center">How to Protect your Trees</h2>
      <hr />
      <div className="container" id='TPblog'>
        <div className="row">
          <div className="col-md-6 sm-12">
          {faqs.map((faq, index) => (
                <div className="wrapper" id='blogwrapper' key={faq.questionid}>
                  <button
                    className="toggle"
                    onClick={() => toggleContent(index)}
                    style={{ color: openIndex === index ? '#0c581d' : '#111130' }}>
                    {faq.question}
                    <i className={`fas ${openIndex === index ? 'fa-minus' : 'fa-plus'} icon`}></i>
                  </button>
                  <div
                    className="content" id='blogcontent'
                    style={{
                      height: openIndex === index ? 'auto' : '0px',
                      opacity: openIndex === index ? '1' : '0',
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-6 sm-12">
              <div className="wrapper1">
                <div className="container" id='TPblog'>
                  {/* Radio buttons and labels */}
                  {faqs.map((faq, index) => (
                    <React.Fragment key={index}>
                      <input
                        type="radio"
                        className='inputTP'
                        name="slide"
                        id={`c${index}`}
                        checked={selectedTopic === index}
                        onChange={() => handleTopicSelect(index)}
                      />
                      <label htmlFor={`c${index}`} className="card" id='c1234' style={{ backgroundImage: `url(${faq.imgurl})` }}>
                        <div className="row" >
                          <div className="descriptionfaqs">
                            <h4>{faq.topictitle}</h4>
                            <p>{faq.titledes}</p>
                          </div>
                        </div>
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Faqs;
