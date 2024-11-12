import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import supabase from '../supabase';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminFaqs = () => {
    const [userData, setUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditFaqModal, setShowEditFaqModal] = useState(false);
    const [showEditTopicModal, setShowEditTopicModal] = useState(false);
    const [currentEditFaq, setCurrentEditFaq] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedAnswer, setEditedAnswer] = useState('');
    const [editedImageUrl, setEditedImageUrl] = useState('');
    const [error, setError] = useState(null);
    const [editedTopicTitle, setEditedTopicTitle] = useState('');
    const [editedTopicDescription, setEditedTopicDescription] = useState('');
    const [pic, setPic] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filename, setFilename] = useState('');
    const [imgurl, setImgUrl] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const closeModal = () => {
        setModalVisible(false);
        setIsLoading(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('faqs').select('questionid, question, answer, topictitle, titledes, imgurl');
                if (error) {
                    throw error;
                }
                setUserData(data);
            } catch (error) {
                console.error('Error fetching FAQ data:', error.message);
                setError(error.message);
            }
        };
        fetchData();
    }, []);

    const filteredData = userData.filter((faq) => {
        const searchTermRegex = new RegExp(searchTerm, 'i');
        return (
            searchTermRegex.test(faq.questionid) ||
            searchTermRegex.test(faq.question) ||
            searchTermRegex.test(faq.answer) ||
            searchTermRegex.test(faq.topictitle) ||
            searchTermRegex.test(faq.titledes) ||
            searchTermRegex.test(faq.imgurl)
        );
    });

    const handleEditFaq = (faq) => {
        setCurrentEditFaq(faq);
        setEditedQuestion(faq.question);
        setEditedAnswer(faq.answer);
        setEditedImageUrl(faq.imgurl);
        setShowEditFaqModal(true);
    };

    const handleEditTopic = (faq) => {
        setCurrentEditFaq(faq);
        setEditedTopicTitle(faq.topictitle);
        setEditedTopicDescription(faq.titledes);
        setEditedImageUrl(faq.imgurl);
        setShowEditTopicModal(true);
    };

    const handleEditSubmitFaq = async (event) => {
        event.preventDefault();
        try {
            const { data, error } = await supabase
                .from('faqs')
                .update({
                    question: editedQuestion,
                    answer: editedAnswer,
                    imgurl: editedImageUrl,
                })
                .eq('questionid', currentEditFaq.questionid);
            if (error) {
                throw error;
            }
            setUserData(userData.map(faq => faq.questionid === currentEditFaq.questionid ? {
                ...faq,
                question: editedQuestion,
                answer: editedAnswer,
                imgurl: editedImageUrl,
            } : faq));
            setShowEditFaqModal(false);
            toast.success('FAQ updated successfully');
        } catch (error) {
            console.error('Error updating FAQ:', error.message);
            toast.error('Error updating FAQ');
        }
    };

    const handleEditSubmitTopic = async (event) => {
        event.preventDefault();
        if (!pic) {
            toast.error("Please upload an image.");
            return;
        }
        setIsLoading(true);
    
        try {
            const fileExt = pic.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            setFilename(fileName);
    
            const { error: uploadError } = await supabase.storage
                .from('faqs-imgs')
                .upload(fileName, pic);
    
            if (uploadError) {
                console.error('Error uploading image:', uploadError.message);
                throw uploadError;
            }
    
            const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/faqs-imgs/${fileName}`;
    
            const { error: updateError } = await supabase
                .from('faqs')
                .update({
                    topictitle: editedTopicTitle,
                    titledes: editedTopicDescription,
                    imgurl: imageUrl,
                })
                .eq('questionid', currentEditFaq.questionid);
    
            if (updateError) {
                console.error('Error updating topic:', updateError.message);
                throw updateError;
            }
    
            toast.success('Topic updated successfully!');
            closeModal();
        } catch (error) {
            console.error('Error updating topic:', error.message);
            setError(error.message);
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleImageChange = (event) => {
        setPic(event.target.files[0]);
    };

    return (
        <div className='app'>
            <Sidebar />
            <section className='userlist-section'>
                <div className="container"><br /><br /><br />
                    <h2 className='overview13'>FAQs:</h2>
                    <div className="row justify-content-start">
                        <div className="col" id='qrtable'>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Question</th>
                                            <th>Answer</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((faq) => (
                                            <tr key={faq.questionid}>
                                                <td className="d-none d-md-table-cell">{faq.question}</td>
                                                <td className="d-none d-md-table-cell">{faq.answer}</td>
                                                <td>
                                                    <Button onClick={() => handleEditFaq(faq)}>Edit</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table><hr/>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Topic Title</th>
                                            <th>Topic Description</th>
                                            <th>Image</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((faq) => (
                                            <tr key={faq.questionid}>
                                                <td className="d-none d-md-table-cell">{faq.topictitle}</td>
                                                <td className="d-none d-md-table-cell">{faq.titledes}</td>
                                                <td className="d-none d-md-table-cell">
                                                    <img src={faq.imgurl} alt={faq.topictitle} style={{ width: '100px' }} />
                                                </td>
                                                <td>
                                                    <Button onClick={() => handleEditTopic(faq)}>Edit</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {error && <p className="error">{error}</p>}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusloss draggable pauseOnHover />

            {/* Edit FAQ Modal */}
            <Modal show={showEditFaqModal} onHide={() => setShowEditFaqModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit FAQ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmitFaq}>
                        <Form.Group controlId="editQuestion">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedQuestion}
                                onChange={(e) => setEditedQuestion(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="editAnswer">
                            <Form.Label>Answer</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedAnswer}
                                onChange={(e) => setEditedAnswer(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Topic Modal */}
            <Modal show={showEditTopicModal} onHide={() => setShowEditTopicModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmitTopic}>
                        <Form.Group controlId="editTopicTitle">
                            <Form.Label>Topic Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTopicTitle}
                                onChange={(e) => setEditedTopicTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="editTopicDescription">
                            <Form.Label>Topic Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTopicDescription}
                                onChange={(e) => setEditedTopicDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="editImage">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminFaqs;
