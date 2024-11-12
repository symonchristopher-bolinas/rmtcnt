import React, { useState, useEffect } from 'react';
import FeedBackcss from '../styles/feedback.module.css';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import Faqs from '../components/Faqs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../AuthContext';
import supabase from '../supabase';

function Feedback() {
  const { user, isAdmin, uid } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [pic, setPic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imgurl, setImgUrl] = useState('');
  const [filename, setFilname] = useState('');


  const openModal = () => {
    if (user) {
      setModalVisible(true);
    } else {
      toast.error('You need to be logged in to post feedback!');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    setPic(e.target.files[0]);
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    if (!pic) {
      toast.error("Please upload an image.");
      return;
    }
    setIsLoading(true);

    try {
      const fileExt = pic.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      setFilname(fileName);
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('feedback-imgs')
        .upload(fileName, pic);

      if (uploadError) throw uploadError;

      const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/feedback-imgs/${fileName}`;
      setImgUrl(imageUrl);
      const currentTime = new Date().toISOString();

      const { error: insertError } = await supabase
        .from('feedbacks')
        .insert({
          name,
          email,
          content,
          imgurl: imageUrl,
          created_at: currentTime,
          posted_by: uid,
        });

      if (insertError) throw insertError;

      toast.success('Feedback submitted successfully!');
      closeModal();
    } catch (error) {
      console.error('Error submitting feedback:', error.message);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
      // Attempt to delete the uploaded image if the database insert fails
      if (imgurl) {
        const { error: deleteError } = await supabase.storage
          .from('feedback-imgs')
          .remove([filename]);
        if (deleteError) {
          toast.error(`error: ${deleteError}`)
        }
      }

    } finally {
      setIsLoading(false);
    }
  };


  // Fetch feedbacks when the component mounts
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        let { data: feedbackData, error } = await supabase
          .from('feedbacks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setFeedbacks(feedbackData);
      } catch (error) {
        console.error('Error fetching feedback:', error.message);
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const deleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return; // Stop the deletion process if the user cancels
    }

    if (!isAdmin) {
      toast.error("Unauthorized operation.");
      return;
    }

    try {
      const { error } = await supabase
        .from('feedbacks')
        .delete()
        .match({ id: feedbackId });

      if (error) throw error;

      toast.success('Feedback deleted successfully!');
      setFeedbacks(feedbacks.filter(fb => fb.id !== feedbackId));
    } catch (error) {
      console.error('Error deleting feedback:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <NavigationBar />
      <header className={FeedBackcss.header}>
        <div className={FeedBackcss.container}>
          <div className={FeedBackcss.containerLeft}><br/><br/><br/>
            <h1>Read what our customers love about us</h1>
            <p>Welcome to Arboreatrix! Your feedback is valuable in helping us improve our system. Please take a moment to share your thoughts and suggestions with us. Your input will guide us in enhancing your experience.</p>
            <p>Additionally, if you've discovered a new indigenous fruit tree species that you'd like us to explore, please let us know! We're passionate about biodiversity and would love to investigate further.</p>
            <p>Thank you for being a part of our community and contributing to the growth of Arboreatrix!</p>
            <button onClick={openModal}>Give Us Your Feedback</button>
          </div>
          <div className={FeedBackcss.containerRight}>
            {feedbacks.map(feedback => (
              <div key={feedback.id} className={FeedBackcss.card}>
                {isAdmin && (
                  <button
                    onClick={() => deleteFeedback(feedback.id)}
                    className={FeedBackcss.deleteButton}
                  >
                    X
                  </button>
                )}
                <img src={feedback.imgurl || './bg.png'} alt="user" />
                <div className={FeedBackcss.card__content}>
                  <span><i className="ri-double-quotes-l"></i></span>
                  <div className={FeedBackcss.card__details}>
                    <p className="truncate-text">{feedback.content}</p>
                    <h4>- {feedback.name}</h4>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {modalVisible && (
          <div id="feedbackModal" className={FeedBackcss.modal} style={{ display: 'block' }}>
            <div className={FeedBackcss.modalContent}>
              <span className={FeedBackcss.close} onClick={closeModal}>&times;</span>
              <h1>Give Us Your Feedback</h1>
              <form className={FeedBackcss.form1} onSubmit={submitFeedback}>
                <div className={FeedBackcss.formGroup}>
                  <label htmlFor="name">Your Name:</label>
                  <input type="text" className="form-control w-100" id="name" name="name" placeholder="Name" required onChange={e => setName(e.target.value)} />
                </div>
                <div className={FeedBackcss.formGroup}>
                  <label htmlFor="email">Your Email:</label>
                  <input type="email" className="form-control w-100" id="email" name="email" placeholder="Email" required onChange={e => setEmail(e.target.value)} />
                </div>
                <div className={FeedBackcss.formGroup}>
                  <label htmlFor="feedback">Your Feedback:</label>
                  <textarea className="form-control w-100" id="feedback" name="feedback" rows="4" placeholder="What do you want to say?" required onChange={e => setContent(e.target.value)}></textarea>
                </div>
                <div className={FeedBackcss.formGroup}>
                  <label htmlFor="pic">Upload Image File:</label>
                  <input type="file" className="form-control w-100" name="pic" accept="image/*" required onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit Feedback'}</button>
              </form>
            </div>
          </div>
        )}
      </header>

      <div className='faqss'>
        <Faqs />
      </div>
      <footer className='footer1'>
        <Footer />
      </footer>

      {error && <p className="error">{error}</p>}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}

export default Feedback;