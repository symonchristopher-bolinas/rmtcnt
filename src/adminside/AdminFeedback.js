import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import supabase from '../supabase';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminFeedback = () => {
    const [userData, setUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEditFaq, setCurrentEditFaq] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedAnswer, setEditedAnswer] = useState('');
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('feedbacks').select('id, name, email, content, imgurl, created_at');
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
            searchTermRegex.test(faq.id) ||
            searchTermRegex.test(faq.name) ||
            searchTermRegex.test(faq.email) ||
            searchTermRegex.test(faq.content) ||
            searchTermRegex.test(faq.imgurl) ||
            searchTermRegex.test(faq.created_at)
        );
    });

    const handleDeleteConfirmation = (id) => {
        setFeedbackToDelete(id);
        setShowConfirmationModal(true);
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase.from('feedbacks').delete().eq('id', feedbackToDelete);
            if (error) {
                throw error;
            }
            toast.success('Feedback deleted successfully!');
            setUserData(userData.filter(faq => faq.id !== feedbackToDelete));
            setShowConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting feedback:', error.message);
            setError(error.message);
        }
    };

    return (
        <div className='app'>
            <Sidebar />
            <section className='userlist-section'>
                <div className="container"><br /><br /><br />
                    <h2 className='overview13'>Feedback:</h2>
                    <div className="row justify-content-start">
                        <div className="col" id='qrtable'>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Content</th>
                                            <th>Image</th>
                                            <th>Created</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((faq) => (
                                            <tr key={faq.id}>
                                                <td>{faq.id}</td>
                                                <td>{faq.name}</td>
                                                <td className="d-none d-md-table-cell">{faq.email}</td>
                                                <td className="d-none d-md-table-cell">{faq.content}</td>
                                                <td className="d-none d-md-table-cell">
                                                    <a href={faq.imgurl} target="_blank" rel="noopener noreferrer">
                                                        <img src={faq.imgurl} alt={faq.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                    </a>
                                                </td>
                                                <td>{faq.created_at}</td>
                                                <td>
                                                    <Button variant="danger" onClick={() => handleDeleteConfirmation(faq.id)}>Delete</Button>
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

            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this feedback?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default AdminFeedback;
